import React, { useState, useEffect } from "react";
import "./Departments.css"; // Import CSS for styling
//import Sidebar from "../components/Sidebar";
const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://localhost:5001/departments");
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await fetch(`http://localhost:5001/departments/${id}`, { method: "DELETE" });
        fetchDepartments(); // Refresh data after delete
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    }
  };

  const handleEdit = (department) => {
    setFormData(department);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.id ? "PUT" : "POST";
    const url = formData.id
      ? `http://localhost:5001/departments/${formData.id}`
      : "http://localhost:5001/departments";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setShowForm(false);
      fetchDepartments(); // Refresh data after add/edit
    } catch (error) {
      console.error("Error submitting department:", error);
    }
  };

  return (
    <div className="container">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="main-content">
        <h2>Manage Departments</h2>

        {/* Buttons aligned at the top */}
        <div className="button-container">
          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close Form" : "Add New Department"}
          </button>
        </div>

        {/* Form appears inside the dashboard */}
        {showForm && (
          <div className="form-container">
            <h3>{formData.id ? "Edit Department" : "Add New Department"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Department Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                required
              ></textarea>
              <button type="submit" className="submit-btn">
                {formData.id ? "Update" : "Add"}
              </button>
            </form>
          </div>
        )}

        {/* Table appears only when form is closed */}
        {!showForm && (
          <table className="department-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Department</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? (
                departments.map((dept, index) => (
                  <tr key={dept.id}>
                    <td>{index + 1}</td>
                    <td>{dept.name}</td>
                    <td>{dept.description}</td>
                    <td>
                    <div className="action-container">
                        <button className="edit-btn" onClick={() => handleEdit(dept)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(dept.id)}>Delete</button>
                    </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">No departments found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Departments;
