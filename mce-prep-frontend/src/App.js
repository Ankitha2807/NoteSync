import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Quora from './components/Quora';
import Semester from './components/Semester';
import Courses from './components/Courses';
import Documents from './components/Documents';
import Aptitude from './components/Aptitude';
import AptitudeQuiz from './components/AptitudeQuiz';
import About from './components/About';        // ✅ Add About import
import Contact from './components/Contact';    // ✅ Add Contact import

// ✅ Corrected API import
import API from './api/api';

const App = () => {
  React.useEffect(() => {
    API.get('/test')
      .then((response) => console.log('API Test Successful:', response.data))
      .catch((error) => console.error('API Test Failed:', error));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/quora" element={<Quora />} />
      <Route path="/semester" element={<Semester />} />
      <Route path="/courses/:semester" element={<Courses />} />
      <Route path="/subjects/:subject/documents" element={<Documents />} />
      <Route path="/aptitude" element={<Aptitude />} />
      <Route path="/aptitude/:topic" element={<AptitudeQuiz />} />
      <Route path="/about" element={<About />} />        {/* ✅ Add About route */}
      <Route path="/contact" element={<Contact />} />    {/* ✅ Add Contact route */}
    </Routes>
  );
};

export default App;