import axios, { AxiosInstance } from 'axios';

const URL_GATEWAY = import.meta.env.VITE_API_URL
const api: AxiosInstance = axios.create({
  baseURL: 'https://pulse-gateway.up.railway.app', // Hoặc lấy từ process.env nếu dùng Vite
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
