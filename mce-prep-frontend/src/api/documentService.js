import axios from 'axios';

const API = axios.create({ 
  baseURL: 'http://localhost:5000/api/documents',
  timeout: 10000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
