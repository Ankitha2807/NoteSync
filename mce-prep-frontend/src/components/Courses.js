import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Courses.css';
import { FaNetworkWired, FaRobot, FaProjectDiagram, FaBrain, FaSearch } from 'react-icons/fa';

const subjectData = {
  5: [
    { name: 'Computer Network', icon: <FaNetworkWired size={30} /> },
    { name: 'Machine Learning', icon: <FaBrain size={30} /> },
    { name: 'FAFL', icon: <FaProjectDiagram size={30} /> },
    { name: 'MIS', icon: <FaRobot size={30} /> },
  ],
  4: [
    { name: 'Operating System', icon: <FaNetworkWired size={30} /> },
    { name: 'Machine Learning', icon: <FaBrain size={30} /> },
    { name: 'FAFL', icon: <FaProjectDiagram size={30} /> },
    { name: 'MIS', icon: <FaRobot size={30} /> },
  ],
};


const CoursesPage = () => {
  const { semester } = useParams();
  const navigate = useNavigate();
  const subjects = subjectData[semester] || [];

  const handleSubjectClick = (subjectName) => {
    navigate(`/subjects/${encodeURIComponent(subjectName)}/documents`);
  };

  return (
    <div className="courses-page">
      <div className="sidebar">{/* Add Sidebar here */}</div>
      <div className="main-content">
        <h1>Courses</h1>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search courses..." />
        </div>
        <div className="course-grid">
          {subjects.map((subject, i) => (
            <div
              key={i}
              className="course-card"
              onClick={() => handleSubjectClick(subject.name)}
            >
              <div className="icon">{subject.icon}</div>
              <p>{subject.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;