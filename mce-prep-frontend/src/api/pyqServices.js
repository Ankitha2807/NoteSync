// src/api/pyqServices.js 
import api from './api';

//const BASE_URL = 'http://localhost:5000/api/pyqs';

// Check if user is admin
export const isUserAdmin = () => {
  const userRole = localStorage.getItem('userRole');
  return userRole === 'admin'; // fixed logic: only true if role is admin
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
  formData.append('role', role); // role used by backend

  const headers = {
    'Content-Type': 'multipart/form-data',
  };

  // If admin, include admin-password header
  if (role === 'admin') {
    headers['admin-password'] = 'admin123';
  }

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

    // Trigger download
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

// Delete PYQ (admin only)
export const deletePYQ = async (pyqId) => {
  const role = localStorage.getItem('userRole') || 'student';

  if (role !== 'admin') {
    throw new Error('Unauthorized: Only admin can delete files.');
  }

  try {
    const response = await api.delete(`/pyqs/${pyqId}`, {
      headers: {
        'admin-password': 'admin123',
        'user-role': 'admin'
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
  try {
    const response = await api.post('/pyqs/verify-admin', { password });
    return response.data;
  } catch (error) {
    console.error('Admin verification error:', error);
    throw error;
  }
};
