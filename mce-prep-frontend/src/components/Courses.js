import React from 'react';
import { useParams } from 'react-router-dom'; 
import './Courses.css';
import { FaNetworkWired, FaRobot, FaProjectDiagram, FaBrain, FaSearch } from 'react-icons/fa';

const subjectData = {
  5: [
    { name: 'Computer Network', icon: <FaNetworkWired size={30} /> },
    { name: 'Machine Learning', icon: <FaBrain size={30} /> },
    { name: 'FAFL', icon: <FaProjectDiagram size={30} /> },
    { name: 'MIS', icon: <FaRobot size={30} /> },
  ],
};

const CoursesPage = () => {
  const { semester } = useParams(); // Accessing the semester from the URL
  const subjects = subjectData[semester] || [];

  return (
    <div className="courses-page">
      <div className="sidebar">/* Add Sidebar here */</div>
      <div className="main-content">
        <h1>Courses</h1>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search courses..." />
        </div>
        <div className="course-grid">
          {subjects.map((subject, i) => (
            <div key={i} className="course-card">
              <div className="icon">{subject.icon}</div> {/* Ensure the icon is inside this div */}
              <p>{subject.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
