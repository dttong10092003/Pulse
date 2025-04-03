import React, { useEffect } from 'react';
import { ConversationSidebar, ConversationDetail } from './components';
import { addMessageToState } from '../../redux/slice/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedConversation, getAllConversations } from '../../redux/slice/chatSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5005');

// const initialConversations = [
//   {
//     conversationId: "61a1b2c3d4e5f6789abcde01",  // ID cuộc trò chuyện
//     groupName: "Alice", // Tên nhóm / cá nhân
//     avatar: 'https://picsum.photos/200?2',  // Avatar của người hoặc nhóm
//     isOnline: false,
//     isGroup: false,  // Nếu là chat nhóm, set là true
//     unreadCount: 0,
//     members: [
//       { userId: 'user1', name: 'Alice', avatar: 'https://picsum.photos/200?1' },
//       { userId: 'user2', name: 'Bob', avatar: 'https://picsum.photos/200?2' }
//     ],
//     messages: [
//       { 
//         conversationId: "61a1b2c3d4e5f6789abcde01", 
//         senderId: 'user1', 
//         content: 'Hello!', 
//         timestamp: '2025-04-01T10:00:00Z', 
//         isSentByUser: false, 
//         senderAvatar: 'https://picsum.photos/200?1',
//         type: 'text',  // Type of message (text, emoji, image, etc.)
//         isDeleted: false,  // Is the message deleted
//         isPinned: false  // Is the message pinned
//       },
//       { 
//         conversationId: "61a1b2c3d4e5f6789abcde01", 
//         senderId: 'user2', 
//         content: 'Hi there!', 
//         timestamp: '2025-04-01T10:02:00Z', 
//         isSentByUser: true, 
//         senderAvatar: 'https://picsum.photos/200?2',
//         type: 'text',
//         isDeleted: false,
//         isPinned: false
//       }
//     ],
//   },
//   {
//     conversationId: "61a1b2c3d4e5f6789abcde02",
//     groupName: "Developers Group",
//     avatar: 'https://picsum.photos/200?group',
//     isOnline: true,
//     isGroup: true,
//     adminId: 'Alice',
//     unreadCount: 2,
//     members: [
//       { userId: 'Alice', name: 'Alice', avatar: 'https://picsum.photos/200?4' },
//       { userId: 'Bob', name: 'Bob', avatar: 'https://picsum.photos/200?5' },
//       { userId: 'Charlie', name: 'Charlie', avatar: 'https://picsum.photos/200?6' }
//     ],
//     messages: [
//       { 
//         conversationId: "61a1b2c3d4e5f6789abcde02", 
//         senderId: 'Alice', 
//         content: 'Hello everyone!', 
//         timestamp: '2025-04-01T09:30:00Z', 
//         isSentByUser: false, 
//         senderAvatar: 'https://picsum.photos/200?4',
//         type: 'text',
//         isDeleted: false,
//         isPinned: false
//       },
//       { 
//         conversationId: "61a1b2c3d4e5f6789abcde02", 
//         senderId: 'Bob', 
//         content: 'Hi Alice!', 
//         timestamp: '2025-04-01T09:32:00Z', 
//         isSentByUser: false, 
//         senderAvatar: 'https://picsum.photos/200?5',
//         type: 'text',
//         isDeleted: false,
//         isPinned: false
//       },
//     ],
//   }
// ];




const Message: React.FC = () => {
  // const [conversations, setConversations] = useState(initialConversations);
  //   const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const conversations = useSelector((state: RootState) => state.chat.conversations);
  const selectedConversation = useSelector((state: RootState) => state.chat.selectedConversation);
  console.log('Useraaaaaaaaaaaaaaa:', user); // Kiểm tra xem user đã được lấy chưa
  console.log('Tokenaaaaaa:', token); // Kiểm tra xem token đã được lấy chưa
  useEffect(() => {
    if (token && user) {
      console.log('Tokenbbbbb:', token);  // Kiểm tra token có hợp lệ không
      console.log('User ID:', user._id);  // Kiểm tra user._id có hợp lệ không
      dispatch(getAllConversations(user._id)); // Lấy tất cả các cuộc trò chuyện của người dùng
    }
  }, [dispatch, user, token]); // Chỉ gọi lại khi user hoặc token thay đổi

  console.log('Conversations:', conversations); // Kiểm tra xem conversations đã được lấy chưa
  console.log('Selected Conversation:', selectedConversation); // Kiểm tra xem cuộc trò chuyện đã được chọn chưa

  useEffect(() => {
    // Lắng nghe sự kiện 'receiveMessage' và cập nhật tin nhắn trong Redux
    socket.on('receiveMessage', (newMessage) => {
      dispatch(addMessageToState(newMessage));
    });

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      socket.off('receiveMessage');
    };
  }, [dispatch]);

  const handleSelectConversation = (conversation: any) => {
    console.log('Selected conversationqweqweqweqwe:', conversation); // Kiểm tra cuộc trò chuyện đã chọn
    dispatch(setSelectedConversation(conversation)); // Cập nhật cuộc trò chuyện đã chọn trong Redux
  };


  return (
    <div className="flex h-screen">
      {/* <ConversationSidebar />
      <ConversationDetail /> */}
      <ConversationSidebar
        onSelectConversation={handleSelectConversation}
        selectedConversationId={selectedConversation?._id || ''}
        conversations={conversations}
      />
      {/* Truyền selectedConversation vào ConversationDetail */}
      <ConversationDetail selectedConversation={selectedConversation} />
    </div>
  );
};

export default Message;
