// src/api/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add request interceptor to include user info for authenticated requests
API.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  
  if (user && config.method !== 'get') {
    const userData = JSON.parse(user);
    
    // For POST/PUT requests, add user data to the body if not already present
    if (!config.data.userName && !config.data.usn && !config.data.role) {
      config.data = {
        ...config.data,
        userName: userData.userName,
        usn: userData.usn,
        role: userData.role,
      };
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;