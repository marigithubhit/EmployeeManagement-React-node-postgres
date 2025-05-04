import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./LeaveDetails.css";

const LeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState(null);

  useEffect(() => {
    fetchLeaveDetails();
  }, []);
console.log("Hello Mari")
  const fetchLeaveDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5001/leaves/${id}`);
      const data = await response.json();
      console.log("hello"+data);
      setLeaves(data);
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

  if (!leavess) return <p>Loading...</p>;

  return (
    <div className="leave-details-container">
      <h2>Leave Details</h2>
      <p><strong>Employee Name:</strong> {leaves.name}</p>
      <p><strong>Leave Type:</strong> {leaves.leave_type}</p>
      <p><strong>Department:</strong> {leaves.department}</p>
      <p><strong>Status:</strong> {leaves.status}</p>

      <button
        onClick={() => handleStatusUpdate(leaves.id,"Approved")}
        disabled={leavess.status !== "Pending"}
        className="approve-btn"
      >
        Approve
      </button>

      <button
        onClick={() => handleStatusUpdate(leaves.id,"Rejected")}
        disabled={leavess.status !== "Pending"}
        className="reject-btn"
      >
        Reject
      </button>

      <button onClick={() => navigate("/leaves")} className="back-btn">
        Back
      </button>
    </div>
  );
};

export default LeaveDetails;
