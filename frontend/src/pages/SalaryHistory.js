import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeLeaves.css"; // Reusing your common styles

const SalaryHistory = () => {
  const [salaryData, setSalaryData] = useState([]);
  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        if (!employeeId) {
          console.error("Employee ID not found in localStorage");
          return;
        }

        const response = await axios.get(
          `http://localhost:5001/api/salary/employee/${employeeId}`
        );
        setSalaryData(response.data);
      } catch (error) {
        console.error("Error fetching salary history", error);
      }
    };

    fetchSalary();
  }, [employeeId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>WorkForce System</h2>
        <nav>
        <a href="/dashboard">Dashboard</a>
          <a href="/employees">Employees</a>
          <a href="/departments" className="active">Department</a>
          <a href="/leaves">Leaves</a>
          <a href="/salary">Salary</a>
          <a href="/settings">Settings</a>
        </nav>
      </div>

      <div className="main-content">
        <div className="header">
        <center><h2>Salary History</h2></center>
        </div>

        <table className="employee-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Emp ID</th>
              <th>Salary</th>
              <th>Allowance</th>
              <th>Deductions</th>
              <th>Total</th>
              <th>Pay Date</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(salaryData) && salaryData.length > 0 ? (
              salaryData.map((row, index) => (
                <tr key={row.id || index}>
                  <td>{index + 1}</td>
                  <td>{row.employee_id}</td>
                  <td>{formatCurrency(row.basic_pay)}</td>
                  <td>{formatCurrency(row.allowance)}</td>
                  <td>{formatCurrency(row.deduction)}</td>
                  <td>{formatCurrency(row.total)}</td>
                  <td>{new Date(row.pay_date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  No salary records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryHistory;
