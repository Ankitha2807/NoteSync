import React, { useState } from "react";
import "./Login.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaUserCircle } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [usn, setUsn] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const usnPattern = /^4MC\d{2}[A-Z]{2}\d{3}$/;
    if (!usnPattern.test(usn)) {
      setError("Invalid USN. Format must be 4MC22CS012");
      return;
    }
    setError("");
    // Navigate or authenticate here
   
    navigate('/Dashboard');
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

          <div className="options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#">Forgot Password?</a>
          </div>
        </div>

        <button className="login-btn" onClick={handleLogin} >
          LOG IN
          
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
