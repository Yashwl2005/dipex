import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Mock an admin token if needed or just public APIs
export default api;
