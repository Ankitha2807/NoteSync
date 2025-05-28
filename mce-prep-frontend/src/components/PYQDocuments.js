//mce-prep-frontend/src/components/PYQDocuments.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Documents.css';
import './PYQDocuments.css';
import { 
  uploadPYQ, 
  getPYQs, 
  downloadPYQ, 
  deletePYQ, 
  isUserAdmin,
  verifyAdminCredentials
} from '../api/pyqServices';
import notesIcon from '../assets/notes.png';
import pyqsIcon from '../assets/pyqs.png';
import aptitudeIcon from '../assets/aptitude.png';
import quoraIcon from '../assets/quora.png';

const PYQDocuments = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [pyqs, setPyqs] = useState([]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [examType, setExamType] = useState('End-Sem');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  
  // Sidebar state and toggle
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    setIsAdmin(isUserAdmin());
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const sidebar = document.querySelector('.sidebar');
      const hamburger = document.querySelector('.hamburger');
      
      if (
        sidebar &&
        !sidebar.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSidebarOpen]);

  const fetchPYQs = useCallback(async () => {
    if (!subject) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log(`Fetching PYQs for subject: ${subject}`);
      const { data } = await getPYQs(subject);
      setPyqs(data);
    } catch (err) {
      console.error('Error fetching PYQs:', err);
      setError('Failed to load PYQs. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [subject]);

  useEffect(() => {
    fetchPYQs();
  }, [fetchPYQs]);

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!name.trim()) {
      setError('Please enter a PYQ name');
      return;
    }
    
    if (!year.trim()) {
      setError('Please enter the year');
      return;
    }

    setLoading(true);
    setError('');
    setUploadSuccess(false);

    try {
      await uploadPYQ(subject, file, name.trim(), year.trim(), examType);
      setUploadSuccess(true);
      setFile(null);
      setName('');
      setYear('');
      setExamType('End-Sem');
      
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Refresh PYQs list
      await fetchPYQs();
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      if (err.response?.status === 401) {
        setError('Admin authentication required. Please login again.');
      } else if (err.response?.status === 413) {
        setError('File too large. Please upload a smaller file.');
      } else {
        setError(err.response?.data?.message || 'Failed to upload PYQ. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (pyqId, filename) => {
    try {
      setError('');
      await downloadPYQ(pyqId, filename);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download PYQ. Please try again.');
    }
  };

  const handleDelete = async (pyqId) => {
    if (!showPasswordPrompt) {
      setDeleteConfirm(pyqId);
      setShowPasswordPrompt(true);
      return;
    }

    if (!adminPassword.trim()) {
      setError('Please enter admin password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verify admin credentials
      await verifyAdminCredentials(adminPassword);
      
      // Delete the PYQ
      await deletePYQ(pyqId);
      
      // Refresh PYQs list
      await fetchPYQs();
      
      // Reset states
      setDeleteConfirm(null);
      setShowPasswordPrompt(false);
      setAdminPassword('');
    } catch (err) {
      console.error('Delete error:', err);
      if (err.response?.status === 401) {
        setError('Invalid admin password');
      } else {
        setError('Failed to delete PYQ. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
    setShowPasswordPrompt(false);
    setAdminPassword('');
    setError('');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="pyq-documents-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className="hamburger" onClick={toggleSidebar}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1 className="header-title">
            {subject ? `${subject.replace(/-/g, ' ')} - PYQs` : 'PYQs'}
          </h1>
        </div>
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </header>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Navigation</h2>
        </div>
        <nav className="sidebar-nav">
          <a href="/notes" className="nav-item">
            <img src={notesIcon} alt="Notes" className="nav-icon" />
            <span>Notes</span>
          </a>
          <a href="/pyqs" className="nav-item active">
            <img src={pyqsIcon} alt="PYQs" className="nav-icon" />
            <span>PYQs</span>
          </a>
          <a href="/aptitude" className="nav-item">
            <img src={aptitudeIcon} alt="Aptitude" className="nav-icon" />
            <span>Aptitude</span>
          </a>
          <a href="/quora" className="nav-item">
            <img src={quoraIcon} alt="Quora" className="nav-icon" />
            <span>Q&A</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Admin Upload Section */}
         
          <section className="upload-section">
            <h2>Upload New PYQ</h2>
            <form onSubmit={handleUpload} className="upload-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pyq-name">PYQ Name *</label>
                  <input
                    type="text"
                    id="pyq-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Mid-Semester Exam"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pyq-year">Year *</label>
                  <input
                    type="text"
                    id="pyq-year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g., 2023"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="exam-type">Exam Type</label>
                  <select
                    id="exam-type"
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                  >
                    <option value="End-Sem">End-Semester</option>
                    <option value="Mid-Sem">Mid-Semester</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="file-input">Choose File *</label>
                  <input
                    type="file"
                    id="file-input"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="upload-button"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload PYQ'}
              </button>
            </form>
          </section>
        
        {/* Status Messages */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        {uploadSuccess && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            PYQ uploaded successfully!
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showPasswordPrompt && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Confirm Deletion</h3>
              <p>Enter admin password to delete this PYQ:</p>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Admin password"
                className="password-input"
              />
              <div className="modal-actions">
                <button 
                  onClick={() => handleDelete(deleteConfirm)}
                  className="confirm-delete-button"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
                <button 
                  onClick={cancelDelete}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PYQs List */}
        <section className="pyqs-section">
          <h2>Available PYQs</h2>
          
          {loading && !pyqs.length ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading PYQs...</p>
            </div>
          ) : pyqs.length === 0 ? (
            <div className="no-pyqs">
              <div className="no-pyqs-icon">📄</div>
              <h3>No PYQs Available</h3>
              <p>No previous year questions have been uploaded for this subject yet.</p>
              {isAdmin && (
                <p className="admin-hint">Use the upload form above to add PYQs.</p>
              )}
            </div>
          ) : (
            <div className="pyqs-grid">
              {pyqs.map((pyq) => (
                <div key={pyq._id} className="pyq-card">
                  <div className="pyq-header">
                    <h3 className="pyq-title">{pyq.name}</h3>
                    <div className="pyq-badges">
                      <span className="exam-type-badge">{pyq.examType}</span>
                      <span className="year-badge">{pyq.year}</span>
                    </div>
                  </div>
                  
                  <div className="pyq-info">
                    <div className="info-item">
                      <span className="info-label">Subject:</span>
                      <span className="info-value">{pyq.subject}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">File Size:</span>
                      <span className="info-value">{formatFileSize(pyq.fileSize)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Uploaded:</span>
                      <span className="info-value">{formatDate(pyq.uploadDate)}</span>
                    </div>
                  </div>
                  
                  <div className="pyq-actions">
                    <button
                      onClick={() => handleDownload(pyq._id, pyq.filename)}
                      className="download-button"
                    >
                      📥 Download
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(pyq._id)}
                        className="delete-button"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default PYQDocuments;