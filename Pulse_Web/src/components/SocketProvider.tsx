import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socket from '../utils/socket';
import { RootState } from '../redux/store';
import { addMessageToState } from '../redux/slice/chatSlice';
import { Message } from '../redux/slice/types'; 

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?._id) return;

    socket.connect();
    socket.emit('setup', user._id);

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
    };
  }, [user?._id, dispatch]);

  return <>{children}</>;
};

export default SocketProvider;
