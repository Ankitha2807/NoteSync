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
import About from './components/About';
import Contact from './components/Contact';

// PYQs Components
import PYQSemester from './components/PYQSemester';
import PYQCourses from './components/PYQCourses';
import PYQDocuments from './components/PYQDocuments';

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
      
      {/* Documents Routes */}
      <Route path="/semester" element={<Semester />} />
      <Route path="/courses/:semester" element={<Courses />} />
      <Route path="/subjects/:subject/documents" element={<Documents />} />
      
      {/* PYQs Routes */}
      <Route path="/pyq-semester" element={<PYQSemester />} />
      <Route path="/pyq-courses/:semester" element={<PYQCourses />} />
      <Route path="/pyq-subjects/:subject/documents" element={<PYQDocuments />} />
      
      <Route path="/aptitude" element={<Aptitude />} />
      <Route path="/aptitude/:topic" element={<AptitudeQuiz />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default App;