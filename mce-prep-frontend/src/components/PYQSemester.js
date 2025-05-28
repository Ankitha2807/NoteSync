// mce-prep-frontend/src/components/PYQSemester.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Semester.css';
import notesIcon from '../assets/notes.png';
import pyqsIcon from '../assets/pyqs.png';
import aptitudeIcon from '../assets/aptitude.png';
import quoraIcon from '../assets/quora.png';

const PYQSemester = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const sidebar = document.querySelector('.sidebar');
      const hamburger = document.querySelector('.hamburger');
      if (
        sidebar &&
        !sidebar.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSidebarOpen]);

  return (
    <div className="quora-container">
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleSidebar}>☰</div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <nav>
          <ul>
            <li onClick={() => navigate('/semester')}>
              <img src={notesIcon} alt="Courses" className="icon" /> Courses
            </li>
            <li onClick={() => navigate('/pyq-semester')}>
              <img src={pyqsIcon} alt="PYQs" className="icon" /> PYQs
            </li>
            <li onClick={() => navigate('/aptitude')}>
              <img src={aptitudeIcon} alt="Aptitude" className="icon" /> Aptitude
            </li>
            <li onClick={() => navigate('/quora')}>
              <img src={quoraIcon} alt="Quora" className="icon" /> Quora
            </li>
            <li onClick={() => navigate('/dashboard')}>
              <span className="icon">🏠</span> Home
            </li>
            <li onClick={() => navigate('/')}>
              <span className="icon">🚪</span> Log Out
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1>PYQ SEMESTER</h1>
        <p className="subtitle">Select your semester to access Previous Year Questions</p>
        <div className="semester-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="semester-box"
              onClick={() => navigate(`/pyq-courses/${index + 1}`)}
            >
              {`${index + 1} Semester`}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PYQSemester;