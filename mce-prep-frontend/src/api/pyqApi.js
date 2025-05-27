// mce-prep-frontend/src/api/pyqApi.js
import axios from 'axios';

const API = axios.create({ 
  baseURL: 'http://localhost:5000/api/pyq',
  timeout: 10000,
});

// Add request interceptor to include user info
API.interceptors.request.use((config) => {
  const userName = localStorage.getItem('userName');
  const usn = localStorage.getItem('usn');
  const role = localStorage.getItem('role');
  
  if (userName && usn && role && config.method !== 'get') {
    if (!config.data) {
      config.data = {};
    }
    
    if (typeof config.data === 'string') {
      try {
        config.data = JSON.parse(config.data);
      } catch (e) {
        console.error('Error parsing config.data string:', e);
      }
    }
    
    config.data.userName = userName;
    config.data.usn = usn;
    config.data.role = role;
  }
  
  return config;
}, (error) => Promise.reject(error));

export const uploadPyq = (formData) =>
  API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getPyqs = (subject) => {
  const encodedSubject = encodeURIComponent(subject);
  return API.get(`/${encodedSubject}`);
};

export const downloadPyq = (id) =>
  API.get(`/download/${id}`, { responseType: 'blob' });

// Admin functions
export const deletePyq = (id) => {
  const role = localStorage.getItem('role');
  return API.delete(`/${id}`, { data: { role } });
};

export const getAllPyqs = () => {
  const role = localStorage.getItem('role');
  return API.get(`/admin/all?role=${role}`);
};