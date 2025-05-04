// Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css"; // Assuming you have styling here

const Sidebar = () => {
  const role = localStorage.getItem("role");

  return (
    <div className="sidebar">
      <h2>WorkForce System</h2>

      <nav>
        {/* Admin Modules */}
        {role === "Admin" && (
          <>
            <NavLink to="/dashboard" activeclassname="active">Dashboard</NavLink>
            <NavLink to="/employees" activeclassname="active">Employees</NavLink>
            <NavLink to="/department" activeclassname="active">Department</NavLink>
            <NavLink to="/salary" activeclassname="active">Salary</NavLink>
            <NavLink to="/leaves" activeclassname="active">Leaves</NavLink>
            <NavLink to="/settings" activeclassname="active">Settings</NavLink>
          </>
        )}

        {/* Employee Modules */}
        {role === "Employee" && (
          <>
            <NavLink to="/myprofile" activeclassname="active">My Profile</NavLink>
            <NavLink to="/leaves" activeclassname="active">Leaves</NavLink>
            <NavLink to="/salary" activeclassname="active">Salary</NavLink>
            <NavLink to="/settings" activeclassname="active">Settings</NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
