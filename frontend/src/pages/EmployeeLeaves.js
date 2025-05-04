import React, { useEffect, useState } from "react";
//import Sidebar from "../components/Sidebar";
import "./EmployeeLeaves.css";

const EmployeeLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: "",
    from_date: "",
    to_date: "",
    description: "",
  });

  const employeeId = localStorage.getItem("employeeId");
  console.log("hello here employeeID"+employeeId)

  useEffect(() => {
    fetch(`http://localhost:5001/employee-leaves/${employeeId}`)
      .then((res) => res.json())
      .then((data) => setLeaves(data))
      .catch((err) => console.error("Failed to fetch leaves:", err));
  }, [showForm]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:5001/employee-leave-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, employee_id: employeeId }),
    });

    if (response.ok) {
      alert("Leave request submitted!");
      setShowForm(false);
      setFormData({ leave_type: "", from_date: "", to_date: "", description: "" });
    } else {
      alert("Error submitting leave.");
    }
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
        <h1>Manage Leaves</h1>
        {!showForm && (
          <button className="add-leave-btn" onClick={() => setShowForm(true)}>
            Add Leave
          </button>
        )}

        {showForm ? (
          <div className="leave-form">
            <h2>Request for Leave</h2>
            <label>Leave Type:</label>
            <select name="leave_type" value={formData.leave_type} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Emergency Leave">Emergency Leave</option>
            </select>

            <label>From:</label>
            <input type="date" name="from_date" value={formData.from_date} onChange={handleChange} />

            <label>To:</label>
            <input type="date" name="to_date" value={formData.to_date} onChange={handleChange} />

            <label>Description:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />

            <button className="submit-btn" onClick={handleSubmit}>
              Add Leave
            </button>
            <button className="cancel-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <table className="leave-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Description</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
            {Array.isArray(leaves) && leaves.length > 0 ? (
  leaves.map((leave, index) => (
    <tr key={leave.id}>
      <td>{index + 1}</td>
      <td>{leave.leave_type}</td>
      <td>{leave.from_date}</td>
      <td>{leave.to_date}</td>
      <td>{leave.description}</td>
      <td>{new Date(leave.created_at).toLocaleDateString()}</td>
      <td className={`status-${leave.status.toLowerCase()}`}>{leave.status}</td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="7">No leave records found.</td>
  </tr>
)}

            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeLeaves;
