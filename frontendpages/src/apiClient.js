// src/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7014/api',
});

// Automatically attach token to each request
apiClient.interceptors.request.use((config) => {

//   localStorage.setItem("token","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJtdXNAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiRmxlZXRNYW5hZ2VyIiwiZXhwIjoxNzUzNzY1ODI4LCJpc3MiOiJEcml2ZXJUcmlwSXNzdWVyIiwiYXVkIjoiRHJpdmVyVHJpcEF1ZGllbmNlIn0.A7-h7wv5bOiBx3_lBY1PTfTkhRS0qe-fzcSEBTY4_S4");
  localStorage.setItem("token","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdWppdGhAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiRHJpdmVyIiwiZXhwIjoxNzUzNzg1ODc4LCJpc3MiOiJEcml2ZXJUcmlwSXNzdWVyIiwiYXVkIjoiRHJpdmVyVHJpcEF1ZGllbmNlIn0.wrojfFha9ISQi6RCEGIuxHoCEEk5ZuRl41s-pOXRbp0");
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;