import axios, { AxiosInstance } from 'axios';

const URL_GATEWAY = import.meta.env.VITE_API_URL
const api: AxiosInstance = axios.create({
  baseURL: URL_GATEWAY, // Hoặc lấy từ process.env nếu dùng Vite
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
