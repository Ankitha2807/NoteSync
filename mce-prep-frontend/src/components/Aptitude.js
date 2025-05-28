import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Aptitude.css';
import notesIcon from '../assets/notes.png';
import pyqsIcon from '../assets/pyqs.png';
import aptitudeIcon from '../assets/aptitude.png';
import quoraIcon from '../assets/quora.png';

// Inline icons
//const timeAndDistanceIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."; 
//const profitAndLossIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."; 
//const speedAndDistanceIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...";
//const percentageIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."; 

const topicData = [
  { name: 'Time and Distance' },
  { name: 'Profit and Loss'},
  { name: 'Speed and Distance' },
  { name: 'Percentage' },
];

const AptitudePage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const sidebar = document.querySelector('.sidebar');
      const hamburger = document.querySelector('.hamburger');
      if (sidebar && hamburger && !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
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
    <div className="aptitude-page">
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
      <div className="main-content">
        <h1>Aptitude Topics</h1>
        <div className="search-box">
          <input type="text" placeholder="Search topics..." />
        </div>
        <div className="topic-grid">
          {topicData.map((topic, i) => (
            <div key={i} className="topic-card" onClick={() => navigate(`/aptitude/${topic.name.toLowerCase().replace(/ /g, '-')}`)}>
              <div className="icon">{topic.icon}</div>
              <p>{topic.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AptitudePage;