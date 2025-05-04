import React, { useEffect, useState } from "react";
import "./Myprofile.css";

const Myprofile = () => {
  const [employee, setEmployee] = useState(null);

  // You should already have this ID stored after login
  const employeeId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:5001/employee/profile/${employeeId}`);
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Employee ID:</strong> {employee.employee_id}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Designation:</strong> {employee.designation}</p>
        <p><strong>Gender:</strong> {employee.gender}</p>
        <p><strong>Date of Birth:</strong> {employee.dob}</p>
        <p><strong>Marital Status:</strong> {employee.marital_status}</p>
        <p><strong>Salary:</strong> ₹{employee.salary}</p>
      </div>
    </div>
  );
};

export default Myprofile;
