import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socket from '../utils/socket';
import { RootState, AppDispatch } from '../redux/store';
import { addMessageToState, getAllConversations } from '../redux/slice/chatSlice';
import { Message } from '../redux/slice/types'; 

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const conversations = useSelector((state: RootState) => state.chat.conversations);
  const dispatch = useDispatch<AppDispatch>();

  const hasConnected = useRef(false);

  useEffect(() => {
    if (!user?._id || hasConnected.current) return;

    socket.connect();
    socket.emit('setup', user._id);
    dispatch(getAllConversations(user._id)); // Load tất cả conversation

    hasConnected.current = true;

    const handleReceiveMessage = (newMessage: Message) => {
      if (newMessage.senderId === user._id) return;
      console.log('📩 Received message from socket:', newMessage);
      dispatch(addMessageToState({
        message: newMessage,
        currentUserId: user._id,
      }));
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.disconnect();
      hasConnected.current = false;
    };
  }, [user?._id, dispatch]);

  // 🔁 2. Mỗi khi conversation thay đổi → join lại các room
  useEffect(() => {
    if (!socket.connected) return;

    conversations.forEach((conv) => {
      socket.emit('joinRoom', conv._id);
    });
  }, [conversations]);

  return <>{children}</>;
};

export default SocketProvider;