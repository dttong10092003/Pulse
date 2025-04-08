import React, { useState, useEffect } from 'react';
import { Upload, SendHorizonal, Smile } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessageToState } from '../../../redux/slice/chatSlice';
import { io } from 'socket.io-client';
import { RootState } from '../../../redux/store';


const socket = io('http://localhost:5005');

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const userDetail = useSelector((state: RootState) => state.auth.userDetail);
  const selectedConversation = useSelector((state: RootState) => state.chat.selectedConversation);
  const dispatch = useDispatch();

  // const handleSend = () => {
  //   if (message.trim()) {
  //     console.log('Message sent:', message);
  //     setMessage('');
  //   }
  // };

  useEffect(() => {
    console.log('Socket ID haha:', socket.id);
  }, []);

  useEffect(() => {
    console.log('Socket ID hihi:', socket.id);
    // Lắng nghe sự kiện receiveMessage từ server
    socket.on('receiveMessage', (newMessage) => {
      dispatch(addMessageToState(newMessage)); // Thêm tin nhắn vào Redux
    });

    // Dọn dẹp khi component unmount
    return () => {
      socket.off('receiveMessage');
    };
  }, [dispatch]);

  const handleSend = () => {
    if (!selectedConversation?._id) {
      console.error('No conversation selected');
      return; // Không gửi tin nhắn nếu không có selectedConversation
    }

    if (message.trim()) {
      // Tạo tin nhắn mới
      // const newMessage = {
      //   conversationId: selectedConversation._id, // Sử dụng _id thay vì conversationId
      //   senderId: "userId", // Cập nhật với userId thực tế từ Redux
      //   name: "User", // Tên người gửi (có thể lấy từ Redux hoặc props)
      //   content: message,
      //   type: 'text' as const,
      //   timestamp: new Date().toISOString(),
      //   isDeleted: false,
      //   isSentByUser: true,
      //   isPinned: false,
      //   senderAvatar: "", // Cập nhật với avatar thực tế từ Redux
      // };

      if(!userDetail) {
        console.error('No user detail found');
        return; // Không gửi tin nhắn nếu không có thông tin người dùng
      }


      const newMessage = {
        conversationId: selectedConversation._id, // Sử dụng _id thay vì conversationId
        senderId: userDetail.userId, // Cập nhật với userId thực tế từ Redux
        name: `${userDetail.firstname} ${userDetail.lastname}`, // Tên người gửi (có thể lấy từ Redux hoặc props)
        content: message,
        type: 'text' as const,
        timestamp: new Date().toISOString(),
        isDeleted: false,
        isSentByUser: true,
        isPinned: false,
        senderAvatar: userDetail?.avatar, // Cập nhật với avatar thực tế từ Redux
      };

      // Gửi tin nhắn qua Socket.IO
      socket.emit('sendMessage', newMessage);

      // Thêm tin nhắn vào Redux state
      dispatch(addMessageToState(newMessage));

      setMessage(''); // Xóa nội dung sau khi gửi
    }
  };

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setEmojiPickerOpen(false);
  };

  return (
    <div className="p-3 bg-[#282828b2] flex items-center rounded-xl">
      {/* Nút Upload */}
      <input type="file" className="hidden" id="fileInput" />
      <label htmlFor="fileInput" className="cursor-pointer">
        <Upload size={20} className="text-white" />
      </label>

      {/* Input text with Emoji button inside */}
      <div className="relative flex-1 mx-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 pl-2 pr-10 rounded-xl bg-[#1212124C]/50 text-white focus:outline-none "
        />

        {/* Emoji button inside input */}
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={() => setEmojiPickerOpen(!isEmojiPickerOpen)}
        >
          <Smile size={18} className="text-white" />
        </button>

        {/* Emoji Picker */}
        {isEmojiPickerOpen && (
          <div className="absolute bottom-12 right-0 p-2 rounded-md shadow-md z-8 w-full max-w-sm overflow-hidden">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {/* Nút gửi */}
      <button
        onClick={handleSend}
        className="bg-green-500 px-4 py-2 rounded-lg text-white flex items-center cursor-pointer"
      >
        <SendHorizonal size={20} />
      </button>
    </div>
  );
};

export default ChatInput;