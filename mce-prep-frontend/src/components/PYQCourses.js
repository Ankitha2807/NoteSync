// mce-prep-frontend/src/components/PYQCourses.js
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
  3: [
    { name: 'Database Management System', icon: <FaNetworkWired size={30} /> },
    { name: 'Computer Organization', icon: <FaBrain size={30} /> },
    { name: 'Data Structures', icon: <FaProjectDiagram size={30} /> },
    { name: 'Object Oriented Programming', icon: <FaRobot size={30} /> },
  ],
  2: [
    { name: 'C Programming', icon: <FaNetworkWired size={30} /> },
    { name: 'Digital Electronics', icon: <FaBrain size={30} /> },
    { name: 'Mathematics II', icon: <FaProjectDiagram size={30} /> },
    { name: 'Engineering Physics', icon: <FaRobot size={30} /> },
  ],
  1: [
    { name: 'Engineering Mathematics I', icon: <FaNetworkWired size={30} /> },
    { name: 'Engineering Chemistry', icon: <FaBrain size={30} /> },
    { name: 'Basic Electronics', icon: <FaProjectDiagram size={30} /> },
    { name: 'Engineering Mechanics', icon: <FaRobot size={30} /> },
  ],
  6: [
    { name: 'Software Engineering', icon: <FaNetworkWired size={30} /> },
    { name: 'Compiler Design', icon: <FaBrain size={30} /> },
    { name: 'Web Technology', icon: <FaProjectDiagram size={30} /> },
    { name: 'Project Work', icon: <FaRobot size={30} /> },
  ],
};

const PYQCourses = () => {
  const { semester } = useParams();
  const navigate = useNavigate();
  const subjects = subjectData[semester] || [];

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    navigate(`/pyq-subjects/${encodeURIComponent(subjectName)}/documents`);
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
      <div className="main-content">
        <h1>PYQ Courses - Semester {semester}</h1>
        <p className="subtitle">Previous Year Questions for all subjects</p>
        
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search PYQ courses..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="course-grid">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject, i) => (
              <div
                key={i}
                className="course-card pyq-card"
                onClick={() => handleSubjectClick(subject.name)}
              >
                <div className="icon">{subject.icon}</div>
                <p>{subject.name}</p>
                <span className="pyq-badge">PYQs Available</span>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No courses found for "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PYQCourses;