import { io } from 'socket.io-client';
const VITE_API_NOTI = import.meta.env.VITE_API_URL_NOTI;
const socket = io(VITE_API_NOTI, {
  transports: ['websocket'], // ✅ đảm bảo không fallback sang polling
  withCredentials: false
});

export default socket;
