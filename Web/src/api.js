import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
});

// Mock an admin token if needed or just public APIs
export default api;
