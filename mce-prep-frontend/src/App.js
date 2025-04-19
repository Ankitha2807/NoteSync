import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Quora from './components/Quora';
import Semester from './components/Semester';
import Courses from './components/Courses'; 

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/quora" element={<Quora/>}/>
      <Route path="/semester" element={<Semester />} />
      <Route path="/courses/:semester" element={<Courses/>} /> {}
    </Routes>
  );
};

export default App;
