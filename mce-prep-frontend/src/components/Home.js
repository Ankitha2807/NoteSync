import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import bgImage from '../assets/library-banner.jpg';  // Make sure the path is correct
import notesIcon from '../assets/notes.png';
import pyqsIcon from '../assets/pyqs.png';
import aptitudeIcon from '../assets/aptitude.png';
import quoraIcon from '../assets/quora.png';

const Home = () => {
  const navigate = useNavigate();
  const goToLogin = () => {
    console.log("Navigating to login page");
    navigate('/Login');
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
          <button onClick={goToLogin}>HOME</button>
          <button onClick={goToLogin}>ABOUT</button>
          <button onClick={goToLogin}>CONTACT US</button>
          <button onClick={goToLogin}>LOG IN</button>
        </nav>
      </header>

      <div
        className="banner"
        style={{
          backgroundImage: `url(${bgImage})`, // Fix for background image
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
          <div className="option" onClick={goToLogin}>
            <img src={notesIcon} alt="Notes" />
            <p>NOTES</p>
          </div>
          <div className="option" onClick={goToLogin}>
            <img src={pyqsIcon} alt="PYQs" />
            <p>PYQs</p>
          </div>
          <div className="option" onClick={goToLogin}>
            <img src={aptitudeIcon} alt="Aptitude" />
            <p>Aptitude</p>
          </div>
          <div className="option" onClick={goToLogin}>
            <img src={quoraIcon} alt="Quora" />
            <p>Quora</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
