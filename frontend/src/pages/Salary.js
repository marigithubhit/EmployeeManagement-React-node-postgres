import React, { useState, useEffect } from "react";
import "./Salary.css"; // Import CSS file for styling

const Salary = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    departmentId: "",
    employeeId: "",
    basicPay: "",
    allowance: "",
    deductions: "",
    payDate: "",
  });

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://localhost:5001/departmentsdrop");
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Fetch employees based on department
  const fetchEmployees = async (departmentId) => {
    try {
      if (!departmentId) {
        setEmployees([]);
        return;
      }
      const response = await fetch(`http://localhost:5001/employeesdrop/${departmentId}`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "departmentId") {
      fetchEmployees(value);
      setFormData((prevState) => ({
        ...prevState,
        departmentId: value,
        employeeId: "", // Reset employee on department change
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/salaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Salary added successfully!");
        setFormData({
          departmentId: "",
          employeeId: "",
          basicPay: "",
          allowance: "",
          deductions: "",
          payDate: "",
        });
        setEmployees([]); // clear employees dropdown as well
      } else {
        alert("Failed to add salary.");
      }
    } catch (error) {
      console.error("Error adding salary:", error);
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>WorkForce System</h2>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/employees">Employees</a>
          <a href="/departments">Departments</a>
          <a href="/leaves">Leaves</a>
          <a href="/salary" className="active">Salary</a>
          <a href="/settings">Settings</a>
        </nav>
      </div>

      <div className="main-content">
        <h2>Add New Salary</h2>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label>Department:</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>

            <label>Employee:</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>

            <label>Basic Pay:</label>
            <input
              type="number"
              name="basicPay"
              value={formData.basicPay}
              onChange={handleInputChange}
              required
            />

            <label>Allowance:</label>
            <input
              type="number"
              name="allowance"
              value={formData.allowance}
              onChange={handleInputChange}
              required
            />

            <label>Deductions:</label>
            <input
              type="number"
              name="deductions"
              value={formData.deductions}
              onChange={handleInputChange}
              required
            />

            <label>Pay Date:</label>
            <input
              type="date"
              name="payDate"
              value={formData.payDate}
              onChange={handleInputChange}
              required
            />

            <button type="submit" className="submit-btn">Add Salary</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Salary;
