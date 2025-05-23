import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Courses.css';
import { FaNetworkWired, FaRobot, FaProjectDiagram, FaBrain, FaSearch } from 'react-icons/fa';

import notesIcon from '../assets/notes.png';
import pyqsIcon from '../assets/pyqs.png';
import aptitudeIcon from '../assets/aptitude.png';
import quoraIcon from '../assets/quora.png';
const subjectData = {
  5: [
    { name: 'Computer Network', icon: <FaNetworkWired size={30} /> },
    { name: 'Machine Learning', icon: <FaBrain size={30} /> },
    { name: 'FAFL', icon: <FaProjectDiagram size={30} /> },
    { name: 'MIS', icon: <FaRobot size={30} /> },
  ],
  4: [
    { name: 'Operating System', icon: <FaNetworkWired size={30} /> },
    { name: 'Machine Learning', icon: <FaBrain size={30} /> },
    { name: 'FAFL', icon: <FaProjectDiagram size={30} /> },
    { name: 'MIS', icon: <FaRobot size={30} /> },
  ],
};

const CoursesPage = () => {
  const { semester } = useParams();
  const navigate = useNavigate();
  const subjects = subjectData[semester] || [];

  // Sidebar state and toggle function
  const [isSidebarOpen, setSidebarOpen] = useState(false);
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

  const handleSubjectClick = (subjectName) => {
    navigate(`/subjects/${encodeURIComponent(subjectName)}/documents`);
  };

  return (
    <div className="courses-page quora-container">
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleSidebar} style={{ cursor: 'pointer' }}>
        ☰
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <nav>
          <ul>
            <li onClick={() => navigate('/semester')}>
              <img src={notesIcon} alt="Courses" className="icon" /> Courses
            </li>
            <li onClick={() => navigate('/semester')}>
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
      <div className="main-content">
        <h1>Courses</h1>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search courses..." />
        </div>
        <div className="course-grid">
          {subjects.map((subject, i) => (
            <div
              key={i}
              className="course-card"
              onClick={() => handleSubjectClick(subject.name)}
            >
              <div className="icon">{subject.icon}</div>
              <p>{subject.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
