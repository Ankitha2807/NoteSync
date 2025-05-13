//mce-prep-frontend/src/api/api.js
import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add request interceptor to attach user data to all non-GET requests
API.interceptors.request.use(
  (config) => {
    // Get user data from localStorage (individual items)
    const userName = localStorage.getItem('userName');
    const usn = localStorage.getItem('usn');
    const role = localStorage.getItem('role');
    
    // Log for debugging
    console.log('API interceptor - config before:', { 
      url: config.url, 
      method: config.method,
      hasUserData: !!(userName && usn && role)
    });
    
    // Only attach user data for non-GET requests if not already in the data
    if (userName && usn && role && config.method !== 'get') {
      // Create data object if it doesn't exist
      if (!config.data) {
        config.data = {};
      }
      
      // If config.data is a string (JSON), parse it
      if (typeof config.data === 'string') {
        try {
          config.data = JSON.parse(config.data);
        } catch (e) {
          console.error('Error parsing config.data string:', e);
        }
      }
      
      // Add user data to request body if not already present
      if (!config.data.userName) {
        config.data.userName = userName;
      }
      if (!config.data.usn) {
        config.data.usn = usn;
      }
      if (!config.data.role) {
        config.data.role = role;
      }
      
      console.log('API interceptor - added user data to request');
    }
    
    // Log final config
    console.log('API interceptor - config after:', { 
      url: config.url, 
      method: config.method,
      data: config.data 
    });
    
    return config;
  },
  (error) => {
    console.error('API interceptor request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    console.log('API response success:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default API;