// File: utils/commentSocket.ts
// import { io } from 'socket.io-client';

// const commentSocket = io('http://localhost:5004', {
//   autoConnect: false,
//   transports: ["websocket"],
// });

// export default commentSocket;


import { io } from 'socket.io-client';

const VITE_API_URL_COMMENT = import.meta.env.VITE_API_URL_COMMENT;

const socket = io(VITE_API_URL_COMMENT, {
  autoConnect: false
});

export default socket;