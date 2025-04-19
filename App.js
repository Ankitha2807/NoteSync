import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Quora from './components/Quora'; 
import Semester from './pages/Semester'; // adjust path as needed




const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/quora" element={<Quora />} /> 
      <Route path="/semester" element={<Semester />} />{/* ✅ path is lowercase */}
    </Routes>
  );
};

export default App;
