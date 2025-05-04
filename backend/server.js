const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'ravi@123',
    port: 5432,
});

// Check database connection
pool.connect()
    .then(client => {
        return client.query('SELECT 1')
            .then(() => {
                console.log('Database connected successfully!');
                client.release();
            })
            .catch(err => {
                console.error('Database connection failed:', err);
                client.release();
            });
    })
    .catch(err => console.error('Error acquiring client:', err));

    app.get("/departments", async (req, res) => {
        try {
            const result = await pool.query('SELECT id, name,description FROM "EmployeeManagement".departments');
            res.json(result.rows);
        } catch (error) {
            console.error("Error fetching departments:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    
    app.post("/login", async (req, res) => {
        const { email, password } = req.body;
        try {
            // Fetch user from the users table
            const result = await pool.query(
                'SELECT * FROM "EmployeeManagement".employees WHERE email = $1',
                [email]
            );
    
            if (result.rows.length === 0) {
                return res.status(401).json({ message: "Invalid email" });
            }
    
            const user = result.rows[0];
    
            // Compare passwords directly
            const isValid = password === user.password;
    
            if (!isValid) {
                return res.status(401).json({ message: "Invalid password" });
            }
    
            // Return user role + employee_id
            res.json({
                message: "Login successful",
                role: user.role,
                employeeId: user.employee_id,
                id: user.id // if needed
            });
        } catch (error) {
            console.error("Login Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });
     

    app.get("/dashboard-data", async (req, res) => {
        try {
            // Fetch Total Employees
            const totalEmployees = await pool.query(`SELECT COUNT(*) AS total FROM "EmployeeManagement".employees`);
            console.log(totalEmployees);
            
            // Fetch Total Departments
            const totalDepartments = await pool.query(`SELECT COUNT(*) AS total FROM "EmployeeManagement".departments`);
            
            // Fetch Monthly Pay (Sum of Salaries)
            const monthlyPay = await pool.query(`SELECT COALESCE(SUM(salary), 0) AS total FROM "EmployeeManagement".employees`);
            
            // Fetch Leave Details
            const leaveDetails = await pool.query(`
                SELECT 
                    COUNT(*) AS applied,
                    COUNT(CASE WHEN status = 'Approved' THEN 1 END) AS approved,
                    COUNT(CASE WHEN status = 'Pending' THEN 1 END) AS pending,
                    COUNT(CASE WHEN status = 'Rejected' THEN 1 END) AS rejected
                FROM "EmployeeManagement".leaves
            `);
    
            res.json({
                totalEmployees: totalEmployees.rows[0].total,
                totalDepartments: totalDepartments.rows[0].total,
                monthlyPay: monthlyPay.rows[0].total,
                leaveDetails: leaveDetails.rows[0],
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    
    // Add New Department
app.post("/departments", async (req, res) => {
    try {
        const { name, description } = req.body;
        await pool.query(`INSERT INTO "EmployeeManagement".departments (name, description) VALUES ($1, $2)`, [name, description]);
        res.json({ message: "Department added successfully!" });
    } catch (error) {
        console.error("Error adding department:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update Department
app.put("/departments/:id", async (req, res) => {
    try {
        const { name, description } = req.body;
        const { id } = req.params;
        await pool.query(`UPDATE "EmployeeManagement".departments SET name=$1, description=$2 WHERE id=$3`, [name, description, id]);
        res.json({ message: "Department updated successfully!" });
    } catch (error) {
        console.error("Error updating department:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete Department
app.delete("/departments/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`DELETE FROM "EmployeeManagement".departments WHERE id=$1`, [id]);
        res.json({ message: "Department deleted successfully!" });
    } catch (error) {
        console.error("Error deleting department:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//leaves details  
// Middleware to check admin role
// const checkAdmin = (req, res, next) => {
//     if (req.user && req.user.role === "Admin") {
//       next();
//     } else {
//       res.status(403).json({ message: "Access denied" });
//     }
//   };
  
//   // Example: Protect add-employee route
//   app.post("/add-employee", checkAdmin, async (req, res) => {
//     // admin-only logic
//   });
  

app.get("/leaves", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                l.employee_id, 
                l.id, 
                e.name,
                e.empid,
                e.department,  
                l.leave_type, 
                (l.to_date - l.from_date) AS days, 
                l.status 
            FROM "EmployeeManagement".leaves l
            JOIN "EmployeeManagement".employees e ON l.employee_id = e.id
        `);

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching leaves:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
  
  // Fetch single leave request by ID
  app.get("/leaves/:employeeId", async (req, res) => {
    const { employeeId } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                l.id, 
                l.employee_id, 
                e.name, 
                d.name AS department, 
                l.leave_type, 
                (l.to_date - l.from_date + 1) AS days, 
                l.status,
                l.from_date,
                l.to_date,
                l.description,
                l.applied_date
            FROM "EmployeeManagement".leaves l
            JOIN "EmployeeManagement".employees e ON l.employee_id = e.id
            JOIN "EmployeeManagement".departments d ON e.department_id = d.id
            WHERE l.employee_id = $1
            ORDER BY l.applied_date DESC
        `, [employeeId]);

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching leaves by employee ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


  
  // Update leave status
  app.put("/update-leave/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log("Received status:", status);
    try {
      const result = await pool.query(
        'UPDATE "EmployeeManagement".leaves SET status = $1 WHERE id = $2',
        [status, id]
      );
      console.log("Update result:", result);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Leave not found" });
      }
      res.json({ message: "Leave status updated successfully" });
    } catch (error) {
      console.error("Error updating leave status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  
app.get("/employees", async (req, res) => {
        try {
            const result = await pool.query(`SELECT id, name, department, image_url,email,designation,salary FROM "EmployeeManagement".employees`);
            res.json(result.rows);
        } catch (error) {
            console.error("Error fetching employees:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });    
// API Routes
app.get('/employees', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "EmployeeManagement".employees');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/add-employee", async (req, res) => {
    try {
        const { name, email, empid, dob, gender, maritalStatus, designation, department_id, salary, password, role } = req.body;

        const result = await pool.query(
            `INSERT INTO "EmployeeManagement".employees (name, email, empid, dob, gender, marital_status, designation, department_id, salary, password, role) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [name, email, empid, dob, gender, maritalStatus, designation, department_id, salary, password, role]
        );
        res.json({ message: "Employee added successfully!", employee: result.rows[0] });
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


//this is for salaries APi 
app.post("/salaries", async (req, res) => {
    try {
        const { departmentId, employeeId, basicPay, allowance, deductions, payDate } = req.body;

        console.log("here i am mari")

        await pool.query(
            `INSERT INTO "EmployeeManagement".salaries (department_id, employee_id, basic_pay, allowance, deduction, pay_date) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [departmentId, employeeId, basicPay, allowance, deductions, payDate]
        );

        res.json({ message: "Salary added successfully!" });
    } catch (error) {
        console.error("Error adding salary:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ FETCH DEPARTMENTS & EMPLOYEES FOR DROPDOWNS
app.get("/departmentsdrop", async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name FROM "EmployeeManagement".departments');
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/employeesdrop", async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name FROM "EmployeeManagement".employees');
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/employeesdrop/:departmentId", async (req, res) => {
    const { departmentId } = req.params;
    try {
        const result = await pool.query(
            'SELECT id, name FROM "EmployeeManagement".employees WHERE department_id = $1',
            [departmentId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//changing password

// Change Password API
app.post("/change-password", async (req, res) => {
    const { email, oldPassword, newPassword } = req.body; 

    try {
        console.log("Received password change request for email:", email);

        // Fetch user by email
        const userResult = await pool.query('SELECT email, password FROM "EmployeeManagement".employees WHERE email = $1', [email]);

        console.log("Database query result:", userResult.rows); 

        if (userResult.rows.length === 0) {
            console.log("User not found in database");
            return res.status(404).json({ message: "User not found" });
        }

        const storedPassword = userResult.rows[0].password;

        // Check if old password matches
        if (storedPassword !== oldPassword) {
            console.log("Old password does not match");
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        // Update password
        await pool.query('UPDATE "EmployeeManagement".employees SET password = $1 WHERE email = $2', [newPassword, email]);

        console.log("Password changed successfully!");
        res.json({ message: "Password changed successfully!" });

    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/employee/profile/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const employeeResult = await pool.query(
        `SELECT 
           id, name, email, employee_id, department_id, designation, 
           gender, dob, marital_status, salary 
         FROM "EmployeeManagement".employees 
         WHERE id = $1`, [id]
      );
  
      if (employeeResult.rows.length === 0) {
        return res.status(404).json({ error: "Employee not found" });
      }
  
      const employee = employeeResult.rows[0];
  
      // Fetch department name
      const deptResult = await pool.query(
        `SELECT name FROM "EmployeeManagement".departments WHERE id = $1`,
        [employee.department_id]
      );
  
      const departmentName = deptResult.rows[0]?.name || "N/A";
  
      res.json({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        employee_id: employee.employee_id,
        designation: employee.designation,
        department: departmentName,
        gender: employee.gender,
        dob: employee.dob,
        marital_status: employee.marital_status,
        salary: employee.salary
      });
    } catch (error) {
      console.error("Error fetching employee profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
// Get leaves by employee
app.get("/employee-leaves/:employeeId", async (req, res) => {
    const { employeeId } = req.params;
    try {
      const result = await pool.query(`
        SELECT * FROM "EmployeeManagement".leaves
        WHERE employee_id = $1
      `, [employeeId]);
      res.json(result.rows);
    } catch (error) {
        console.error('Database connection failed:', error);
      res.status(500).json({ error: "Error fetching leaves" });
    }
  });
  
  // Employee requests a leave
  app.post("/employee-leave-request", async (req, res) => {
    const { employee_id, leave_type, from_date, to_date, description } = req.body;
    try {
      await pool.query(`
        INSERT INTO "EmployeeManagement".leaves (employee_id, leave_type, from_date, to_date, description, status, applied_date)
        VALUES ($1, $2, $3, $4, $5, 'Pending', NOW())
      `, [employee_id, leave_type, from_date, to_date, description]);
  
      res.status(200).json({ message: "Leave request submitted." });
    } catch (error) {
        console.log("Error we are getting"+error);
      res.status(500).json({ error: "Error submitting leave request." });
    }
  });
// Get salary history for a specific employee
app.get("/api/salary/employee/:employeeId", async (req, res) => {
    const { employeeId } = req.params;
  
    try {
      const result = await pool.query(
        `SELECT id, employee_id, basic_pay, allowance, deduction, 
                (basic_pay + allowance - deduction) AS total, pay_date 
         FROM "EmployeeManagement".salaries
         WHERE employee_id = $1 
         ORDER BY pay_date DESC`,
        [employeeId]
      );
  
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching employee salary history:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  app.get("/salary/:id", async (req, res) => {
    const empId = req.params.id;
  
    try {
      const result = await pool.query(
        `SELECT id, employee_id, basic_pay, allowance, deduction, total, pay_date, department_id 
         FROM "EmployeeManagement".salaries 
         WHERE employee_id = $1`,
        [empId]
      );
      res.json(result.rows); // ✅ Always returns an array
    } catch (err) {
      console.error("Error fetching salary data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  
  // ✅ Route to get leave data by employee ID
  app.get("/employee-leaves/:id", async (req, res) => {
    const empId = req.params.id;
  
    try {
      const result = await pool.query(
        "SELECT * FROM leaves WHERE empid = $1",
        [empId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching leave data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 5002 });

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    ws.send('Hello Client!');
});