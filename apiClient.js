// src/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7291/api',
});

// Automatically attach token to each request
apiClient.interceptors.request.use((config) => {

  localStorage.setItem("token","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJtdXNAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiRmxlZXRNYW5hZ2VyIiwiZXhwIjoxNzUzNzIzNDA3LCJpc3MiOiJEcml2ZXJUcmlwSXNzdWVyIiwiYXVkIjoiRHJpdmVyVHJpcEF1ZGllbmNlIn0.aDNjJL8ZcWPtVsDrv2pj3Fus4UL4xb3IJtg8Rhey5fM");
  
  const token = localStorage.getItem('token'); // Or sessionStorage.getItem
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
