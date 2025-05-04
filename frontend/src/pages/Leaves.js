import React, { useState, useEffect } from "react";
import "./Leaves.css";
//import Sidebar from "../components/Sidebar";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedLeave, setSelectedLeave] = useState(null); // State for selected leave details

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await fetch("http://localhost:5001/leaves");
      const data = await response.json();
      
      setLeaves(data);
      setFilteredLeaves(data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const handleFilter = (status) => {
    setFilter(status);
    if (status === "All") {
      setFilteredLeaves(leaves);
    } else {
      setFilteredLeaves(leaves.filter((leave) => leave.status === status));
    }
  };

  const handleView = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/leaves/${id}`);
      const data = await response.json();
      // console.log(data);
      setSelectedLeave(data);
    } catch (error) {
      console.error("Error fetching leave details:", error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/update-leave/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (response.ok) {
        alert(`Leave request ${newStatus}`);
        fetchLeaves(); // Refresh leave list
      } else {
        console.error("Failed to update leave status.");
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };
  

  return (
    <div className="container">
      <div className="sidebar">
        <h2>WorkForce System</h2>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/employees">Employees</a>
          <a href="/department">Department</a>
          <a href="/leaves" className="active">Leaves</a>
          <a href="/salary">Salary</a>
          <a href="/settings">Settings</a>
        </nav>
      </div>

      <div className="main-content">
        <h1>Manage Leaves</h1>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button onClick={() => handleFilter("Pending")}>Pending</button>
          <button onClick={() => handleFilter("Approved")}>Approved</button>
          <button onClick={() => handleFilter("Rejected")}>Rejected</button>
        </div>

        {/* Show Leave Details if selected */}
        {selectedLeave ? (
          <div className="leave-details-container">
            <h2>Leave Details</h2>
            <p><strong>Employee Name:</strong> {selectedLeave.name}</p>
            <p><strong>Leave Type:</strong> {selectedLeave.leave_type}</p>
            <p><strong>Department:</strong> {selectedLeave.department}</p>
            <p><strong>Status:</strong> {selectedLeave.status}</p>

            <button
              onClick={() => handleStatusUpdate("Approved")}
              disabled={selectedLeave.status !== "Pending"}
              className="approve-btn"
            >
              Approve
            </button>

            <button
              onClick={() => handleStatusUpdate("Rejected")}
              disabled={selectedLeave.status !== "Pending"} 
              className="reject-btn"
            >
              Reject
            </button>

            <button onClick={() => setSelectedLeave(null)} className="back-btn">
              Back
            </button>
          </div>
        ) : (
          // Leave Table
          <table className="leave-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Leave Type</th>
                <th>Department</th>
                <th>Days</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
  {filteredLeaves.length > 0 ? (
    filteredLeaves.map((leave, index) => (
      <tr key={leave.id}>
        <td>{index + 1}</td>
        <td>{leave.empid}</td>
        <td>{leave.name}</td>
        <td>{leave.leave_type}</td>
        <td>{leave.department}</td>
        <td>{leave.days}</td>
        <td className={`status-${leave.status.toLowerCase()}`}>{leave.status}</td>
        <td>
          <button
            className="approve-btn"
            onClick={() => handleStatusUpdate(leave.id, "Approved")}
            disabled={leave.status !== "Pending"}
          >
            Approve
          </button>
          <button
            className="reject-btn"
            onClick={() => handleStatusUpdate(leave.id, "Rejected")}
            disabled={leave.status !== "Pending"}
          >
            Reject
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8">No leave records found</td>
    </tr>
  )}
</tbody>

          </table>
        )}
      </div>
    </div>
  );
};

export default Leaves;
