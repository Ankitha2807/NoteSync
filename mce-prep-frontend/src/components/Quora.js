import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quora.css';
import notesIcon from '../assets/notes.png';
import pyqsIcon from '../assets/pyqs.png';
import aptitudeIcon from '../assets/aptitude.png';
import quoraIcon from '../assets/quora.png';
import API from '../api/api';

const Quora = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [doubt, setDoubt] = useState('');
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [replyText, setReplyText] = useState('');
  const [expandedDoubtId, setExpandedDoubtId] = useState(null);
  const [similarDoubtFound, setSimilarDoubtFound] = useState(null);
  
  const navigate = useNavigate();

  // Get logged-in user details from localStorage
  const userName = localStorage.getItem('userName');
  const usn = localStorage.getItem('usn');
  const role = localStorage.getItem('role');
  
  // Check if user is admin
  const isAdmin = usn === '4MC25CS196' || role === 'admin';

  // Define fetchDoubts with useCallback to memoize it
  const fetchDoubts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', 10);
      
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      
      const response = await API.get(`/doubts?${params.toString()}`);
      // Ensure that every doubt has an answers array, even if empty
      const processedDoubts = response.data.doubts.map(d => ({
        ...d,
        answers: d.answers || []
      }));
      setDoubts(processedDoubts);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching doubts:', err);
      setError('Failed to load doubts. Please try again later.');
      setLoading(false);
    }
  }, [currentPage, selectedCategory]);

  // Fetch doubts from API with the memoized function in the dependency array
  useEffect(() => {
    fetchDoubts();
  }, [fetchDoubts]);

  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Close sidebar on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const sidebar = document.querySelector('.sidebar');
      const hamburger = document.querySelector('.hamburger');
      if (
        sidebar &&
        !sidebar.contains(e.target) &&
        hamburger && // Add a null check for hamburger
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

  // Submit doubt
  const handleSubmit = async () => {
    if (!doubt.trim()) {
      alert('Please enter a doubt before submitting.');
      return;
    }

    // Ensure user info exists
    if (!userName || !usn || !role) {
      alert('User not logged in. Please log in first.');
      return;
    }

    try {
      setSimilarDoubtFound(null); // Reset similar doubt display
      
      console.log('Submitting doubt:', {
        questionText: doubt,
        userName,
        usn,
        role
      });
      
      const response = await API.post('/doubts/ask', {
        questionText: doubt,
        userName,
        usn,
        role,
      });

      console.log('Doubt submission response:', response.data);

      if (response.data.isDuplicate) {
        // Ensure similarDoubtFound has answers array
        const processedDoubt = {
          ...response.data.doubt,
          answers: response.data.doubt.answers || []
        };
        setSimilarDoubtFound(processedDoubt);
        alert('A similar doubt already exists! Check below.');
      } else {
        alert(response.data.message || 'Doubt submitted successfully!');
        setDoubt('');
        // Refresh doubts list
        fetchDoubts();
      }
    } catch (error) {
      console.error('❌ Error submitting doubt:', error);
      alert('Failed to submit doubt. Please try again.');
    }
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  // Toggle expanded doubt
  const toggleExpandDoubt = (doubtId) => {
    setExpandedDoubtId(expandedDoubtId === doubtId ? null : doubtId);
    setReplyText(''); // Clear reply text when toggling
  };

  // Submit an answer to a doubt
  const handleAnswerSubmit = async (doubtId) => {
    if (!replyText.trim()) {
      alert('Please enter your answer before submitting.');
      return;
    }

    // Ensure user info exists
    if (!userName || !usn || !role) {
      alert('User not logged in. Please log in first.');
      return;
    }

    try {
      const response = await API.post(`/doubts/${doubtId}/answer`, {
        answerText: replyText,
        userName,
        usn,
        role,
      });

      alert('Answer submitted successfully!');
      setReplyText('');
      
      // Ensure the doubt in the response has an answers array
      const processedDoubt = {
        ...response.data.doubt,
        answers: response.data.doubt.answers || []
      };
      
      // Update the doubt in the local state
      const updatedDoubts = doubts.map(d => 
        d._id === doubtId ? processedDoubt : d
      );
      setDoubts(updatedDoubts);
    } catch (error) {
      console.error('❌ Error submitting answer:', error);
      alert('Failed to submit answer. Please try again.');
    }
  };

  // Mark doubt as resolved
  const handleMarkResolved = async (doubtId) => {
    try {
      const response = await API.patch(`/doubts/${doubtId}/resolve`, {
        userName,
        usn,
        role,
      });

      // Ensure the doubt in the response has an answers array
      const processedDoubt = {
        ...response.data.doubt,
        answers: response.data.doubt.answers || []
      };
      
      // Update the doubt in the local state
      const updatedDoubts = doubts.map(d => 
        d._id === doubtId ? processedDoubt : d
      );
      setDoubts(updatedDoubts);
      
      alert('Doubt marked as resolved!');
    } catch (error) {
      console.error('❌ Error marking doubt as resolved:', error);
      alert('Failed to mark as resolved. ' + (error.response?.data?.message || 'Please try again.'));
    }
  };

  // Delete doubt (Admin only)
  const handleDeleteDoubt = async (doubtId) => {
    if (!isAdmin) {
      alert('Only admins can delete doubts.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this doubt? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('Attempting to delete doubt:', doubtId);
      console.log('User data:', { usn, role });

      // Try DELETE method first
      let response;
      try {
        response = await API.delete(`/doubts/${doubtId}`, {
          data: { usn, role }
        });
      } catch (deleteError) {
        console.log('DELETE method failed, trying POST method');
        // Fallback to POST method
        response = await API.post(`/doubts/${doubtId}/delete`, {
          usn, 
          role
        });
      }

      console.log('Delete response:', response);

      // Remove the doubt from local state
      const updatedDoubts = doubts.filter(d => d._id !== doubtId);
      setDoubts(updatedDoubts);
      
      alert('Doubt deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting doubt:', error);
      console.error('Error response:', error.response);
      alert('Failed to delete doubt. ' + (error.response?.data?.message || 'Please try again.'));
    }
  };

  // Delete answer (Admin only)
  const handleDeleteAnswer = async (doubtId, answerId) => {
    if (!isAdmin) {
      alert('Only admins can delete answers.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this answer? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await API.delete(`/doubts/${doubtId}/answer/${answerId}`, {
        data: { usn, role }
      });

      // Ensure the doubt in the response has an answers array
      const processedDoubt = {
        ...response.data.doubt,
        answers: response.data.doubt.answers || []
      };
      
      // Update the doubt in the local state
      const updatedDoubts = doubts.map(d => 
        d._id === doubtId ? processedDoubt : d
      );
      setDoubts(updatedDoubts);
      
      alert('Answer deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting answer:', error);
      alert('Failed to delete answer. ' + (error.response?.data?.message || 'Please try again.'));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Pagination controls
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="quora-container">
      {/* Hamburger */}
      <div className="hamburger" onClick={toggleSidebar}>☰</div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <nav>
          <ul>
            <li onClick={() => navigate('/semester')}>
              <img src={notesIcon} alt="Courses" className="icon" /> Courses
            </li>
            <li onClick={() => navigate('/pyq-semester')}>
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

      {/* Main content */}
      <main className="main-content">
        <h1>Quora Section {isAdmin && <span className="admin-badge">👑 Admin</span>}</h1>
        
        {/* Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            style={{ padding: '8px 16px', cursor: 'pointer' }}
            className={`category ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => handleCategorySelect('All')}
          >
            All Doubts
          </button>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
            <p>Supplementary</p>
            <p>Re-evaluation</p>
            <p>Classroom</p>
            <p>Library</p>
          </div>
        </div>

        {/* Ask Doubt */}
        <div className="ask-doubt-section">
          <h2>Ask a New Doubt</h2>
          <textarea
            placeholder="Type your doubt here..."
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
            className="doubt-textarea"
          />
          <button className="ask-doubt-btn" onClick={handleSubmit}>
            Ask Your Doubts ➡️
          </button>
        </div>

        {/* Similar Doubt Found Display */}
        {similarDoubtFound && (
          <div className="similar-doubt-alert">
            <h3>Similar Doubt Already Exists</h3>
            <div className="doubt-card">
              <div className="doubt-header">
                <span className="doubt-author">Asked by: {similarDoubtFound.userName} ({similarDoubtFound.role})</span>
                <span className="doubt-date">{formatDate(similarDoubtFound.createdAt)}</span>
              </div>
              <p className="doubt-text">{similarDoubtFound.questionText}</p>
              
              {similarDoubtFound.answers && similarDoubtFound.answers.length > 0 && (
                <div className="answers-section">
                  <h4>Answers ({similarDoubtFound.answers.length})</h4>
                  {similarDoubtFound.answers.map((answer, idx) => (
                    <div key={idx} className="answer-card">
                      <div className="answer-header">
                        <span className="answer-author">
                          {answer.userName} ({answer.role})
                        </span>
                        <span className="answer-date">{formatDate(answer.createdAt)}</span>
                      </div>
                      <p className="answer-text">{answer.answerText}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Doubts List */}
        <div className="doubts-list">
          <h2>Recent Doubts</h2>
          
          {loading ? (
            <p className="loading-text">Loading doubts...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : doubts.length === 0 ? (
            <p className="no-doubts-text">No doubts found. Be the first to ask!</p>
          ) : (
            <>
              {doubts.map((doubt) => (
                <div 
                  key={doubt._id} 
                  className={`doubt-card ${doubt.isResolved ? 'resolved' : ''}`}
                >
                  <div className="doubt-header">
                    <div className="doubt-info">
                      <span className="doubt-author">Asked by: {doubt.userName} ({doubt.role})</span>
                      <span className="doubt-date">{formatDate(doubt.createdAt)}</span>
                      {doubt.isResolved && <span className="resolved-badge">Resolved</span>}
                    </div>
                    {isAdmin && (
                      <button 
                        className="delete-btn admin-delete"
                        onClick={() => handleDeleteDoubt(doubt._id)}
                        title="Delete this doubt"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  
                  <p className="doubt-text">{doubt.questionText}</p>
                  
                  <div className="doubt-actions">
                    <button 
                      className="action-btn"
                      onClick={() => toggleExpandDoubt(doubt._id)}
                    >
                      {expandedDoubtId === doubt._id ? 'Hide Answers' : `View Answers (${(doubt.answers || []).length})`}
                    </button>
                    
                    {/* Only show Resolve button to the original asker */}
                    {usn === doubt.usn && !doubt.isResolved && (
                      <button 
                        className="resolve-btn"
                        onClick={() => handleMarkResolved(doubt._id)}
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                  
                  {/* Expanded section with answers */}
                  {expandedDoubtId === doubt._id && (
                    <div className="expanded-doubt">
                      {/* Existing answers */}
                      {(doubt.answers || []).length > 0 ? (
                        <div className="answers-section">
                          <h4>Answers</h4>
                          {doubt.answers.map((answer, idx) => (
                            <div key={idx} className="answer-card">
                              <div className="answer-header">
                                <div className="answer-info">
                                  <span className="answer-author">
                                    {answer.userName} ({answer.role})
                                  </span>
                                  <span className="answer-date">{formatDate(answer.createdAt)}</span>
                                </div>
                                {isAdmin && (
                                  <button 
                                    className="delete-btn admin-delete answer-delete"
                                    onClick={() => handleDeleteAnswer(doubt._id, answer._id)}
                                    title="Delete this answer"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                              <p className="answer-text">{answer.answerText}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-answers-text">No answers yet. Be the first to answer!</p>
                      )}
                      
                      {/* Answer form */}
                      {!doubt.isResolved && (
                        <div className="reply-form">
                          <textarea
                            placeholder="Write your answer here..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="reply-textarea"
                          />
                          <button 
                            className="reply-btn"
                            onClick={() => handleAnswerSubmit(doubt._id)}
                          >
                            Submit Answer
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="page-btn"
                  >
                    Previous
                  </button>
                  
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="page-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Quora;