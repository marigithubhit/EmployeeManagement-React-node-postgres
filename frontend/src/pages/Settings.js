import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of Navigate
import "./Settings.css"; // Import CSS file

const Settings = () => {
  const navigate = useNavigate(); // Initialize navigate

  const [formData, setFormData] = useState({
    email: "", // Email for user identification
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
});

const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
        alert("New password and confirm password do not match!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5001/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.email, // Send email to identify user
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            }),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Password changed successfully!");
            setFormData({ email: "", oldPassword: "", newPassword: "", confirmPassword: "" });
        } else {
            alert(result.message); // Show error message if password doesn't match
        }
    } catch (error) {
        console.error("Error changing password:", error);
        alert("Something went wrong. Try again later.");
    }
};


  const handleLogout = () => {
    // Logic for logout (clear session, redirect to login, etc.)
    navigate("/"); // Navigate to the login page
    //alert("Logged out successfully!");
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
          <a href="/salary">Salary</a>
          <a href="/settings" className="active">Settings</a>
        </nav>
      </div>

      <div className="main-content">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        <h2>Change Password</h2>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            
          <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <label>Old Password:</label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleInputChange}
              required
            />

            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />

            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />

            <button type="submit" className="submit-btn">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
