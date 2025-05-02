import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Courses.css';
import notesIcon from '../assets/notes.png';
import pyqsIcon from '../assets/pyqs.png';
import aptitudeIcon from '../assets/aptitude.png';
import quoraIcon from '../assets/quora.png';

const subjectData = {
  5: [
    { name: 'Computer Network', icon: <img src={notesIcon} alt="Computer Network" className="course-icon" /> },
    { name: 'Machine Learning', icon: <img src={pyqsIcon} alt="Machine Learning" className="course-icon" /> },
    { name: 'FAFL', icon: <img src={aptitudeIcon} alt="FAFL" className="course-icon" /> },
    { name: 'MIS', icon: <img src={quoraIcon} alt="MIS" className="course-icon" /> },
  ],
};

const CoursesPage = () => {
  const { semester } = useParams();
  const subjects = subjectData[semester] || [];
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
    <div className="courses-page">
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleSidebar}>☰</div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <nav>
          <ul>
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <nav>
                      <ul>
                        <li onClick={() => navigate('/semester')}>
                          <img src={notesIcon} alt="Courses" className="icon" /> Courses
                        </li>
                        <li onClick={() => navigate('/pyqs')}>
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
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <h1>Courses</h1>
        <div className="search-box">
          <input type="text" placeholder="Search courses..." />
        </div>
        <div className="course-grid">
          {subjects.map((subject, i) => (
            <div key={i} className="course-card">
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
