import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import your components
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
//import Salaries from "./pages/Salaries";
import Leaves from "./pages/Leaves";
import Settings from "./pages/Settings";
import Myprofile from "./pages/Myprofile";
import Salary from "./pages/Salary";
import Login from "./pages/Login";
import EmployeeLeaves from "./pages/EmployeeLeaves";
import SalaryHistory from "./pages/SalaryHistory";
import EmployeeLeave from "./pages/EmployeeLeave";
import EmployeeSalary from "./pages/EmployeeSalary";

const App = () => {
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        {role === "Admin" && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/department" element={<Departments />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/employee-salary/:id" element={<EmployeeSalary />} />
           <Route path="/employee-leave/:id" element={<EmployeeLeave />} />

          </>
        )}

        {/* Employee Routes */}
        {role === "Employee" && (
          <>
            <Route path="/myprofile" element={<Myprofile />} />
            <Route path="/leaves" element={<EmployeeLeaves />} />
            <Route path="/salary" element={<SalaryHistory />} />
            <Route path="/settings" element={<Settings />} />
          </>
        )}

        {/* Catch All – Redirect if unauthorized or invalid route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
