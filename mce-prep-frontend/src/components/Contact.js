import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Get in touch with us!</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-section">
            <h2>Get In Touch</h2>
            <p>
              Have questions about our platform? Need technical support? 
              Want to suggest new features? We're here to help!
            </p>
          </div>

          <div className="contact-details">
            <div className="contact-item">
              <h3>📧 Email</h3>
              <p>support@elearning.com</p>
              <p>admin@elearning.com</p>
            </div>

            <div className="contact-item">
              <h3>📞 Phone</h3>
              <p>+1 (555) 123-4567</p>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            </div>

            <div className="contact-item">
              <h3>📍 Address</h3>
              <p>123 Education Street</p>
              <p>Learning City, LC 12345</p>
              <p>United States</p>
            </div>

            <div className="contact-item">
              <h3>⏰ Support Hours</h3>
              <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h2>Send us a Message</h2>
          {submitted ? (
            <div className="success-message">
              <h3>✅ Message Sent Successfully!</h3>
              <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="course">Course Related</option>
                  <option value="account">Account Issues</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="partnership">Partnership Inquiry</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Please describe your inquiry in detail..."
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>How do I access course materials?</h4>
            <p>After logging in, navigate to your dashboard and select the desired semester and course.</p>
          </div>
          <div className="faq-item">
            <h4>Can I download study documents?</h4>
            <p>Yes, all study materials and documents are available for download in PDF format.</p>
          </div>
          <div className="faq-item">
            <h4>How do aptitude tests work?</h4>
            <p>Select a topic from the aptitude section, take the quiz, and get instant results with explanations.</p>
          </div>
          <div className="faq-item">
            <h4>Is there a mobile app available?</h4>
            <p>Currently, our platform is web-based and mobile-responsive. A dedicated app is in development.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;