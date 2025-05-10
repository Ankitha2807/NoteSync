import React, { useState } from "react";
import "./Login.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaUserCircle } from "react-icons/fa";
import API from "../api/api";

const Login = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [usn, setUsn] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const usnPattern = /^4MC\d{2}[A-Z]{2}\d{3}$/;

    // Reset error
    setError("");

    // Validate role selection
    if (!role) {
      setError("Please select User or Admin role");
      return;
    }

    // Validate inputs
    if (!userName.trim()) {
      setError("Username is required");
      return;
    }

    // Admin credentials check
    if (role === "admin") {
      if (userName !== "admin" || usn !== "4MC25CS196") {
        setError("Invalid Admin Credentials");
        return;
      }
    } else {
      // User login validation
      if (!usnPattern.test(usn)) {
        setError("Invalid USN. Format must be 4MC22CS012");
        return;
      }
    }

    setIsLoading(true);

    try {
      console.log("Sending login request with data:", { userName, usn, role });

      const response = await API.post("/auth/login", {
        userName,
        usn,
        role,
      });

      console.log("Login successful:", response);

      // Store user data
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userName", userName);
      localStorage.setItem("usn", usn);
      localStorage.setItem("role", role);
      localStorage.setItem("isLoggedIn", "true");
      

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        console.error("Error response data:", err.response.data);
        setError(err.response.data.message || "Login failed");
      } else if (err.request) {
        console.error("No response from server.");
        setError("No response from server. Check if the server is running.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-navbar">
      <nav className="navbar">
        <div className="logo-section">
          <img src={logo} alt="Logo" className="logo" />
          <span className="logo-text">NoteSync</span>
        </div>
        <ul className="nav-links">
          <li onClick={() => navigate("/")}>HOME</li>
          <li>ABOUT</li>
          <li>CONTACT US</li>
          <li>LOG IN</li>
        </ul>
      </nav>

      <div className="login-container">
        <div className="login-card">
          <div className="avatar">
            <FaUserCircle size={60} />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <FaUser />
            </div>
            <input
              type="text"
              placeholder="USER NAME"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              type="text"
              placeholder="USN"
              value={usn}
              onChange={(e) => setUsn(e.target.value.toUpperCase())}
            />
          </div>

          <div className="role-selection">
            <label>
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={(e) => setRole(e.target.value)}
              />{" "}
              User
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
              />{" "}
              Admin
            </label>
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#">Forgot Password?</a>
          </div>
        </div>

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "LOGGING IN..." : "LOG IN"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
