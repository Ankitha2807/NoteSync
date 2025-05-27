// mce-prep-frontend/src/api/documentService.js
import axios from 'axios';

const API = axios.create({ 
  baseURL: 'http://localhost:5000/api/documents',
  timeout: 10000,
});

// Add request interceptor to include admin credentials when needed
API.interceptors.request.use((config) => {
  // Check if user is admin and add admin credentials
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.role === 'admin') {
    config.headers['user-role'] = 'admin';
    // You can also add admin password if needed
    // config.headers['admin-password'] = 'admin123';
  }
  return config;
}, (error) => Promise.reject(error));

export const uploadDocument = (formData) =>
  API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getDocuments = (subject) => {
  const encodedSubject = encodeURIComponent(subject);
  return API.get(`/${encodedSubject}`);
};

export const downloadDocument = (id) =>
  API.get(`/download/${id}`, { responseType: 'blob' });

// Delete document function with admin verification
export const deleteDocument = (id, adminPassword = null) => {
  const config = {};
  
  // If admin password is provided, include it in the request
  if (adminPassword) {
    config.data = { adminPassword };
  }
  
  return API.delete(`/${id}`, config);
};

export const getAllDocuments = () =>
  API.get('/admin/all');

// Helper function to check if user is admin
export const isUserAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'admin';
};

// Function to verify admin credentials
export const verifyAdminCredentials = (password) => {
  // You can add a separate endpoint for this or handle it client-side
  // For now, we'll use a simple password check
  const ADMIN_PASSWORD = 'admin123'; // This should match your backend
  return password === ADMIN_PASSWORD;
};