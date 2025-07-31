// src/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7014/api',
});

// Automatically attach token to each request
apiClient.interceptors.request.use((config) => {
 
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;