import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EmployeeLeave = () => {
  const { id } = useParams();
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await fetch(`http://localhost:5001/employee-leaves/${id}`);
        const data = await res.json();
        setLeaves(data);
      } catch (err) {
        console.error("Error fetching leaves", err);
      }
    };

    fetchLeaves();
  }, [id]);

  return (
    <div className="container">
      <div className="sidebar">
        <h2>WorkForce System</h2>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/employees">Employees</a>
          <a href="/departments">Departments</a>
          <a href="/leaves" className="active">Leaves</a>
          <a href="/salary">Salary</a>
          <a href="/settings">Settings</a>
        </nav>
      </div>

      <div className="main-content">
        <div className="leave-container">
          <h2>Leave History for Employee ID: {id}</h2>
          <table className="leave-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave, index) => (
                <tr key={leave.id}>
                  <td>{index + 1}</td>
                  <td>{leave.leave_type}</td>
                  <td>{leave.from_date}</td>
                  <td>{leave.to_date}</td>
                  <td>{leave.status}</td>
                  <td>{leave.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeave;
