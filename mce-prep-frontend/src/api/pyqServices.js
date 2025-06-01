// src/api/pyqServices.js 
import api from './api';

// Check if user is admin - More secure version
export const isUserAdmin = async () => {
  try {
    const userRole = localStorage.getItem('userRole');
    const adminToken = localStorage.getItem('adminToken');
    
    // First check localStorage
    if (userRole !== 'admin' || !adminToken) {
      return false;
    }
    
    // Verify with backend (optional additional security)
    const response = await api.get('/pyqs/auth/verify-admin', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'user-role': userRole
      }
    });
    
    return response.data.isAdmin;
  } catch (error) {
    console.error('Admin verification failed:', error);
    return false;
  }
};

// Alternative simpler version if you don't want backend verification
export const isUserAdminSimple = () => {
  const userRole = localStorage.getItem('userRole');
  const adminToken = localStorage.getItem('adminToken');
  
  // Both role and token must be present
  return userRole === 'admin' && adminToken;
};

// Upload PYQ (allowed for both admin and student)
export const uploadPYQ = async (subject, file, name, year, examType = 'End-Sem') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('subject', subject);
  formData.append('name', name);
  formData.append('year', year);
  formData.append('examType', examType);

  // User info
  const userName = localStorage.getItem('userName') || 'Anonymous';
  const usn = localStorage.getItem('usn') || 'N/A';
  const role = localStorage.getItem('userRole') || 'student';

  formData.append('userName', userName);
  formData.append('usn', usn);
  formData.append('role', role);

  const headers = {
    'Content-Type': 'multipart/form-data',
  };

  console.log('Uploading PYQ with data:', {
    subject,
    name,
    year,
    examType,
    fileName: file.name,
    role
  });

  try {
    const response = await api.post('/pyqs/upload', formData, { headers });
    return response;
  } catch (error) {
    console.error('Upload error in service:', error);
    throw error;
  }
};

// Get PYQs by subject
export const getPYQs = async (subject) => {
  try {
    const response = await api.get(`/pyqs/${encodeURIComponent(subject)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching PYQs:', error);
    throw error;
  }
};

// Download PYQ (open to all)
export const downloadPYQ = async (pyqId, filename) => {
  try {
    const response = await api.get(`/pyqs/download/${pyqId}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || 'pyq-document.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

// Delete PYQ (admin only) - Enhanced security
export const deletePYQ = async (pyqId, adminPassword) => {
  // Client-side admin check first
  const userRole = localStorage.getItem('userRole');
  const adminToken = localStorage.getItem('adminToken');
  
  if (userRole !== 'admin' || !adminToken) {
    throw new Error('Unauthorized: Admin access required');
  }

  try {
    const response = await api.delete(`/pyqs/${pyqId}`, {
      data: { adminPassword }, // Send password in request body
      headers: {
        'user-role': userRole,
        'admin-password': adminPassword,
        'Authorization': `Bearer ${adminToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

// Verify admin password for delete confirmation
export const verifyAdminCredentials = async (password) => {
  // Client-side admin check first
  const userRole = localStorage.getItem('userRole');
  const adminToken = localStorage.getItem('adminToken');
  
  if (userRole !== 'admin' || !adminToken) {
    throw new Error('Unauthorized: Admin access required');
  }

  try {
    const response = await api.post('/pyqs/verify-admin', { 
      password 
    }, {
      headers: {
        'user-role': userRole,
        'Authorization': `Bearer ${adminToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Admin verification error:', error);
    throw error;
  }
};

// Get all PYQs (admin only)
export const getAllPYQsAdmin = async (adminPassword) => {
  // Client-side admin check first
  const userRole = localStorage.getItem('userRole');
  const adminToken = localStorage.getItem('adminToken');
  
  if (userRole !== 'admin' || !adminToken) {
    throw new Error('Unauthorized: Admin access required');
  }

  try {
    const response = await api.get('/pyqs/admin/all', {
      headers: {
        'user-role': userRole,
        'admin-password': adminPassword,
        'Authorization': `Bearer ${adminToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all PYQs:', error);
    throw error;
  }
};