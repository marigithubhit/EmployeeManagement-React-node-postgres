import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Employees.css";

const Employees = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    empid: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    designation: "",
    department_id: "",
    salary: "",
    password: "",
    role: ""
  });

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:5001/departments");
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          setDepartments(data);
        } else {
          setDepartments([]);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5001/employees");
      const data = await response.json();
      console.log(data);
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, image_url: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/add-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      alert(data.message);
      setShowForm(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error submitting employee:", error);
      alert("Failed to add employee!");
    }
  };

  // Handle edit input change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee({ ...selectedEmployee, [name]: value });
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/update-employee/${selectedEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedEmployee)
      });
      const data = await response.json();
      alert(data.message);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee!");
    }
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>WorkForce System</h2>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/employees" className="active">Employees</a>
          <a href="/department">Department</a>
          <a href="/leaves">Leaves</a>
          <a href="/salary">Salary</a>
          <a href="/settings">Settings</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>Manage Employees</h1>
          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close Form" : "Add Employee"}
          </button>
        </div>

        {/* Employee Table */}
        {!showForm && !selectedEmployee && (
          <table className="employee-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Email</th>
                <th>Name</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee, index) => (
                  <tr key={employee.id}>
                    <td>{index + 1}</td>
                    <td>{employee.email}</td>
                    <td>{employee.name}</td>
                    <td>{employee.department}</td>
                    <td>
                      <div className="action-container">
                        <button className="action-btn view" onClick={() => {
                          setSelectedEmployee(employee);
                          setIsEditMode(false);
                        }}>View</button>
                        {/* <button className="action-btn edit" onClick={() => {
                          setSelectedEmployee(employee);
                          setIsEditMode(true);
                        }}>Edit</button> */}
                        <button className="action-btn salary" onClick={() => navigate(`/employee-salary/${employee.id}`)}>Salary</button>
                        <button className="action-btn leave" onClick={() => navigate(`/employee-leave/${employee.id}`)}>Leave</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Add Employee Form */}
        {showForm && (
          <div className="form-container">
            <h2>Add Employee</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Name" onChange={handleInputChange} required />
              <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
              <input type="text" name="empid" placeholder="Employee ID" onChange={handleInputChange} required />
              <input type="date" name="dob" onChange={handleInputChange} required />

              <select name="gender" onChange={handleInputChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <select name="maritalStatus" onChange={handleInputChange} required>
                <option value="">Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>

              <input type="text" name="designation" placeholder="Designation" onChange={handleInputChange} required />

              <select name="department_id" onChange={handleInputChange} required>
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>

              <input type="number" name="salary" placeholder="Salary" onChange={handleInputChange} required />
              <input type="password" name="password" placeholder="Password" onChange={handleInputChange} required />

              <select name="role" onChange={handleInputChange} required>
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
              </select>

              {/* <input type="file" name="image" onChange={handleInputChange} /> */}

              <button type="submit" className="submit-btn">Add Employee</button>
            </form>
          </div>
        )}

        {/* View / Edit Employee */}
        {selectedEmployee && (
          <div className="employee-details">
            <h2>{isEditMode ? "Edit Employee" : "Employee Details"}</h2>
            {!isEditMode ? (
              <>
                <p><strong>Name:</strong> {selectedEmployee.name}</p>
                <p><strong>Email:</strong> {selectedEmployee.email}</p>
                <p><strong>Department:</strong> {selectedEmployee.department}</p>
                <p><strong>Designation:</strong> {selectedEmployee.designation}</p>
                <p><strong>Salary:</strong> {selectedEmployee.salary}</p>
                {selectedEmployee.url && (
                  <img src={selectedEmployee.image_url} alt="Employee" className="employee-img-large" />
                )}
              </>
            ) : (
              <form onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  name="name"
                  value={selectedEmployee.name}
                  onChange={handleEditChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={selectedEmployee.email}
                  onChange={handleEditChange}
                  required
                />
                <input
                  type="text"
                  name="empid"
                  value={selectedEmployee.empid}
                  onChange={handleEditChange}
                  required
                />
                <select
                  name="department"
                  value={selectedEmployee.department}
                  onChange={handleEditChange}
                  required
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="designation"
                  value={selectedEmployee.designation}
                  onChange={handleEditChange}
                  required
                />
                <input
                  type="number"
                  name="salary"
                  value={selectedEmployee.salary}
                  onChange={handleEditChange}
                  required
                />
                <button type="submit" className="submit-btn">Update</button>
              </form>
            )}
            <button className="close-btn" onClick={() => setSelectedEmployee(null)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
