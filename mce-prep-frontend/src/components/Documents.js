// mce-prep-frontend/src/components/Documents.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Documents.css';

import { 
  uploadDocument, 
  getDocuments, 
  downloadDocument, 
  deleteDocument, 
  isUserAdmin,
  verifyAdminCredentials
} from '../api/documentService';

import notesIcon from '../assets/notes.png';
import pyqsIcon from '../assets/pyqs.png';
import aptitudeIcon from '../assets/aptitude.png';
import quoraIcon from '../assets/quora.png';

const Documents = () => {
  const { subject } = useParams();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
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
    // Check if user is admin
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

  const fetchDocuments = useCallback(async () => {
    if (!subject) return;

    setLoading(true);
    setError('');

    try {
      console.log(`Fetching documents for subject: ${subject}`);
      const { data } = await getDocuments(subject);
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [subject]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!name.trim()) {
      setError('Please enter a document name');
      return;
    }

    setLoading(true);
    setError('');
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', subject);
    formData.append('name', name);

    try {
      await uploadDocument(formData);
      setUploadSuccess(true);
      setFile(null);
      setName('');
      fetchDocuments();
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, docName) => {
    try {
      const { data } = await downloadDocument(id);
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${docName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading document:', err);
      setError('Failed to download document. Please try again.');
    }
  };

  const handleDeleteConfirm = (doc) => {
    setDeleteConfirm(doc);
    setShowPasswordPrompt(true);
    setAdminPassword('');
  };

  const handlePasswordSubmit = async () => {
    if (!verifyAdminCredentials(adminPassword)) {
      setError('Invalid admin password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await deleteDocument(deleteConfirm._id, adminPassword);
      setDocuments(documents.filter(doc => doc._id !== deleteConfirm._id));
      setDeleteConfirm(null);
      setShowPasswordPrompt(false);
      setAdminPassword('');
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
    setShowPasswordPrompt(false);
    setAdminPassword('');
  };

  return (
    <div className="documents-page">
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleSidebar} style={{ cursor: 'pointer' }}>
        ☰
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <nav>
          <ul>
            <li onClick={() => navigate('/semester')}>
              <img src={notesIcon} alt="Courses" className="icon" /> Courses
            </li>
            <li onClick={() => navigate('/semester')}>
              <img src={pyqsIcon} alt="PYQs" className="icon" /> PYQs
            </li>
            <li onClick={() => navigate('/aptitude')}>
              <img src={aptitudeIcon} alt="Aptitude" className="icon" /> Aptitude
            </li>
            <li onClick={() => navigate('/quora')}>
              <img src={quoraIcon} alt="Quora" className="icon" /> Quora
            </li>
            <li onClick={() => navigate('/dashboard')}>
              <span className="icon">🏠</span> Home
            </li>
            <li onClick={() => navigate('/')}>
              <span className="icon">🚪</span> Log Out
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content documents-container">
        <h1>
          Documents for {subject}
          {isAdmin && <span className="admin-badge"> (Admin Mode)</span>}
        </h1>

        {error && <div className="error-message">{error}</div>}
        {uploadSuccess && <div className="success-message">Document uploaded successfully!</div>}

        <div className="upload-section">
          <h2>Upload New Document</h2>
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label htmlFor="docName">Document Name:</label>
              <input
                type="text"
                id="docName"
                placeholder="Enter document name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="docFile">Select File (it should be of .pdf format):</label>
              <input
                type="file"
                id="docFile"
                onChange={(e) => setFile(e.target.files[0])}
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Document'}
            </button>
          </form>
        </div>

        <div className="documents-list">
          <h2>Available Documents</h2>
          {loading && <p>Loading documents...</p>}

          {!loading && documents.length === 0 && (
            <p>No documents found for this subject. Upload one to get started!</p>
          )}

          {documents.length > 0 && (
            <ul>
              {documents.map((doc) => (
                <li key={doc._id} className={isAdmin ? 'admin-mode' : ''}>
                  <div className="document-info">
                    <span className="document-name">{doc.name}</span>
                    <span className="document-date">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                    {isAdmin && (
                      <span className="document-uploader">
                        By: {doc.userName} ({doc.usn})
                      </span>
                    )}
                  </div>
                  <div className="document-actions">
                    <button
                      onClick={() => handleDownload(doc._id, doc.name)}
                      className="download-button"
                    >
                      Download
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteConfirm(doc)}
                        className="delete-button"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Password Prompt Modal */}
        {showPasswordPrompt && deleteConfirm && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Admin Verification Required</h3>
              <p>Enter admin password to delete "{deleteConfirm.name}":</p>
              <div className="password-input-group">
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="modal-actions">
                <button 
                  onClick={handlePasswordSubmit} 
                  className="confirm-delete" 
                  disabled={loading || !adminPassword}
                >
                  {loading ? 'Deleting...' : 'Delete Document'}
                </button>
                <button onClick={cancelDelete} className="cancel-delete" disabled={loading}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;