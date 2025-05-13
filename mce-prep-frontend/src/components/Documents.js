//mce-prep-frontend/src/api/documentService.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { uploadDocument, getDocuments, downloadDocument } from '../api/documentService';
 // Optional - you can create this file for styling

const Documents = () => {
  const { subject } = useParams();
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
    
    // Validate input
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

  return (
    <div className="documents-container">
      <h1>Documents for {subject}</h1>
      
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
            <label htmlFor="docFile">Select File:</label>
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
              <li key={doc._id}>
                <div className="document-info">
                  <span className="document-name">{doc.name}</span>
                  <span className="document-date">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                <button 
                  onClick={() => handleDownload(doc._id, doc.name)}
                  className="download-button"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Documents;