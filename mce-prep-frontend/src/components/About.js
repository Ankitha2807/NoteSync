import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Our E-Learning Platform</h1>
        <p>Empowering students with comprehensive educational resources</p>
      </div>

      <div className="about-content">
        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
            We are dedicated to providing high-quality educational resources and tools 
            to help students excel in their academic journey. Our platform offers a 
            comprehensive learning experience with courses, documents, aptitude tests, 
            and interactive quizzes.
          </p>
        </section>

        <section className="features-section">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>📚 Comprehensive Courses</h3>
              <p>Access semester-wise courses with detailed study materials and resources.</p>
            </div>
            <div className="feature-card">
              <h3>📄 Study Documents</h3>
              <p>Download notes, previous year questions, and reference materials.</p>
            </div>
            <div className="feature-card">
              <h3>🧠 Aptitude Tests</h3>
              <p>Practice aptitude questions to enhance your problem-solving skills.</p>
            </div>
            <div className="feature-card">
              <h3>🎯 Interactive Quizzes</h3>
              <p>Test your knowledge with topic-wise quizzes and instant feedback.</p>
            </div>
            <div className="feature-card">
              <h3>💡 Q&A Platform</h3>
              <p>Get answers to your questions from peers and experts.</p>
            </div>
            <div className="feature-card">
              <h3>📊 Progress Tracking</h3>
              <p>Monitor your learning progress with detailed analytics.</p>
            </div>
          </div>
        </section>

        <section className="vision-section">
          <h2>Our Vision</h2>
          <p>
            To become the leading educational platform that bridges the gap between 
            traditional learning and modern technology, making quality education 
            accessible to every student, everywhere.
          </p>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-list">
            <div className="value-item">
              <h4>Excellence</h4>
              <p>We strive for the highest quality in all our educational content and services.</p>
            </div>
            <div className="value-item">
              <h4>Accessibility</h4>
              <p>Education should be available to everyone, regardless of their background.</p>
            </div>
            <div className="value-item">
              <h4>Innovation</h4>
              <p>We continuously evolve our platform with the latest educational technologies.</p>
            </div>
            <div className="value-item">
              <h4>Community</h4>
              <p>We foster a supportive learning community where students help each other grow.</p>
            </div>
          </div>
        </section>

        
      </div>
    </div>
  );
};

export default About;