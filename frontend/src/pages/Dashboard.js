
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Import CSS for styling
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    monthlyPay: 0,
    leaveDetails: {
      applied: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
    },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:5001/dashboard-data");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);
  // Logout function
  const handleLogout = () => {
    // Clear any stored session (if applicable)
    localStorage.removeItem("userRole");
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>WorkForce System</h2>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/employees">Employees</a>
          <a href="/department">Department</a>
          <a href="/leaves">Leaves</a>
          <a href="/salary">Salary</a>
          <a href="/settings">Settings</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>Dashboard Overview</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        {/* Overview Cards */}
        <div className="overview">
          <div className="card">
            <h3>Total Employees</h3>
            <p>{dashboardData.totalEmployees}</p>
          </div>
          <div className="card">
            <h3>Total Departments</h3>
            <p>{dashboardData.totalDepartments}</p>
          </div>
          <div className="card">
            <h3>Monthly Pay</h3>
            <p>{dashboardData.monthlyPay}</p>
          </div>
        </div>

        {/* Leave Details */}
        <h2>Leave Details</h2>
        <div className="leave-details">
          <div className="leave-card applied">
            <h3>Leave Applied</h3>
            <p>{dashboardData.leaveDetails.applied}</p>
          </div>
          <div className="leave-card approved">
            <h3>Leave Approved</h3>
            <p>{dashboardData.leaveDetails.approved}</p>
          </div>
          <div className="leave-card pending">
            <h3>Leave Pending</h3>
            <p>{dashboardData.leaveDetails.pending}</p>
          </div>
          <div className="leave-card rejected">
            <h3>Leave Rejected</h3>
            <p>{dashboardData.leaveDetails.rejected}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
