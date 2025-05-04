# 🧑‍💼 Employee Management System

A full-stack Employee Management System built using **React.js**, **Node.js**, and **PostgreSQL**. This system supports both **Admin** and **Employee** roles with features such as employee records, department management, salary tracking, leave requests, and more — all within a dynamic, responsive dashboard.

---

## 📌 Features

### 🛠 Admin Module:
- Super Dashboard with live stats:
  - Total Employees
  - Total Departments
  - Monthly Salary
  - Leave Status Overview
- Manage Employees:
  - Add, View, Edit Employee Records
  - Assign Salaries and Handle Leaves
- Departments:
  - Create, Update, Delete Departments
- Salary Management:
  - Assign and Record Monthly Salary with Allowance & Deductions
- Leave Management:
  - View Requests, Approve/Reject based on status
- Settings:
  - Change Password, Logout Functionality

### 👨‍💻 Employee Module:
- My Profile:
  - View personal details
- Leaves:
  - Request for Leave
  - View Leave History and Status
- Salary:
  - View Salary History
- Settings:
  - Change Password, Logout

---

## 🧰 Tech Stack

- **Frontend**: React.js (CSS-based styling)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: Role-based Login (Admin / Employee)
- **Other Tools**: Nodemon, Pg, Axios, React Router

---

## 🗃️ Database Schema Overview

- `employees` – Employee records (linked with departments)
- `departments` – List of all departments
- `leaves` – Leave requests and status
- `salary` – Monthly salary breakdown

---

## 🚀 Installation & Setup

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Run the backend
cd ../backend
npm run dev

# Run the frontend
cd ../frontend
npm start


Folder Structure

employee-management-system/
│
├── backend/
│   └── server.js, routes, database config
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.js
│       └── index.js
│
└── README.md
