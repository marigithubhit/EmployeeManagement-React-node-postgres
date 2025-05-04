import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EmployeeSalary.css";


const EmployeeSalary = () => {
  const { id } = useParams();
  const [salaryData, setSalaryData] = useState([]);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const res = await fetch(`http://localhost:5001/salary/${id}`);
        const data = await res.json();
        setSalaryData(data);
      } catch (err) {
        console.error("Error fetching salary data", err);
      }
    };

    fetchSalaryData();
  }, [id]);

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
      <div className="salary-container">
        <h2>Salary History for Employee ID: {id}</h2>
        <table className="salary-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Basic</th>
              <th>Allowance</th>
              <th>Deductions</th>
              <th>Total</th>
              <th>Pay Date</th>
            </tr>
          </thead>
          <tbody>
            {salaryData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.basic_pay}</td>
                <td>{item.allowance}</td>
                <td>{item.deduction}</td>
                <td>{Number(item.basic_pay) + Number(item.allowance) - Number(item.deduction)}</td>
                <td>{item.pay_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
  

  );
};

export default EmployeeSalary;
