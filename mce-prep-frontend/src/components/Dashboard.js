//mce-prep-frontend/src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import bgImage from '../assets/library-banner.jpg';
import notesIcon from '../assets/notes.png';
import pyqsIcon from '../assets/pyqs.png';
import aptitudeIcon from '../assets/aptitude.png';
import quoraIcon from '../assets/quora.png';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    navigate('/');
  };

  const goToQuora = () => {
    navigate('/quora');
  };
  const goToSemester = () => {
    navigate('/semester'); 
  };

  const goToPyqSemester = () => {
    navigate('/pyq-semester');
  };

  const goToAptitude = () => {
    navigate('/aptitude'); 
  };
  return (
    <div className="home">
      <header className="navbar">
        <div className="brand">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSORqGcwx8D5tDjm0qPmqrG3UfaIb84Q8qAWA&s"
            alt="Logo"
            className="logo"
          />
          <h1 className="title">NoteSync</h1>
        </div>
        <nav className="nav-links">
           <button>HOME</button>
          <button onClick={() => navigate('/about')}>ABOUT</button>
          <button onClick={() => navigate('/contact')}>CONTACT US</button>
          <button onClick={handleLogout}>LOG OUT</button>
        </nav>
      </header>

      <div
        className="banner"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          position: 'relative',
          color: 'white',
        }}
      >
        <h2>WELCOME</h2>
        <h3>Get inspired, then get started.</h3>
        <div className="options">
          <div className="option" onClick={goToSemester} style={{ cursor: 'pointer' }}>
            <img src={notesIcon} alt="Notes" />
            <p>NOTES</p>
          </div>
          <div className="option" onClick={goToPyqSemester} style={{ cursor: 'pointer' }}>
            <img src={pyqsIcon} alt="PYQs" />
            <p>PYQs</p>
          </div>
          <div className="option" onClick={goToAptitude} style={{ cursor: 'pointer' }}>
            <img src={aptitudeIcon} alt="Aptitude" />
            <p>Aptitude</p>
          </div>
          <div className="option" onClick={goToQuora} style={{ cursor: 'pointer' }}>
            <img src={quoraIcon} alt="Quora" />
            <p>Quora</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
