import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Make sure to import the CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(localStorage.setItem("role", data.role));
        //console.log(localStorage.setItem("userId", data.id));
        console.log(localStorage.setItem("employeeId", data.id));
        if (data.role === "Admin") {
          navigate("/dashboard");
        } else if (data.role === "Employee") {
          navigate("/settings"); // Update if needed
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
      <h3>WorkForce System</h3>
        <div className="subtitle">Please login to continue</div>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
        <div className="forgot-password">Forgot Password?</div>
      </div>
    </div>
  );
};

export default Login;
