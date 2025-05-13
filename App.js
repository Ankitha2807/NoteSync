import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Quora from './components/Quora';
import Semester from './components/Semester';
import Courses from './components/Courses';
import Documents from './components/Documents'; // Ensure proper import
import Aptitude from './components/Aptitude';
import API from './api/axios'; // Centralized API configuration

const App = () => {
  // Test API Integration (Optional, for Debugging)
  

  return (
    <Routes>
      {/* Core Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Feature-Specific Pages */}
      <Route path="/quora" element={<Quora />} />
      <Route path="/semester" element={<Semester />} />
      <Route path="/courses/:semester" element={<Courses />} />
      <Route path="/subjects/:subject/documents" element={<Documents />} /> {/* Ensure correct dynamic param */}
      <Route path="/aptitude" element={<Aptitude />} />
    </Routes>
  );
};

export default App;