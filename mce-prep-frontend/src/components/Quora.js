import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quora.css';
import notesIcon from '../assets/notes.png';
import pyqsIcon from '../assets/pyqs.png';
import aptitudeIcon from '../assets/aptitude.png';
import quoraIcon from '../assets/quora.png';

const Quora = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [doubt, setDoubt] = useState('');
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

  const handleSubmit = () => {
    if (doubt.trim()) {
      alert(`Doubt Submitted: ${doubt}`);
      setDoubt('');
    }
  };

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

      {/* Main Content */}
      <main className="main-content">
        <h1>Quora Section</h1>
        <div className="categories">
          <button className="category">Supplementary Queries</button>
          <button className="category">Re-evaluation Doubts</button>
          <button className="category">Classrooms</button>
          <button className="category">Library Books</button>
        </div>

        {/* Ask Doubt Section */}
        <div className="ask-doubt-section">
          <textarea
            placeholder="Type your doubt here..."
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
          />
          <button className="ask-doubt-btn" onClick={handleSubmit}>
            Ask Your Doubts ➡️
          </button>
        </div>
      </main>
    </div>
  );
};

export default Quora;
