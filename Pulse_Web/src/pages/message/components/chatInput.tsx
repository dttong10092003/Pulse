import React, { useState } from 'react';
import { Upload, SendHorizonal, Smile, Trash2 } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessageToState } from '../../../redux/slice/chatSlice';
import { RootState, AppDispatch } from '../../../redux/store';
import socket from '../../../utils/socket';
import { Message } from '../../../redux/slice/types';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const userDetail = useSelector((state: RootState) => state.auth.userDetail);
  const selectedConversation = useSelector((state: RootState) => state.chat.selectedConversation);
  const dispatch = useDispatch<AppDispatch>();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!selectedConversation?._id) {
      console.error('No conversation selected');
      return; // Không gửi tin nhắn nếu không có selectedConversation
    }

    if (message.trim() || selectedFiles.length > 0) {
      if (!userDetail) {
        console.error('No user detail found');
        return; // Không gửi tin nhắn nếu không có userDetail
      }

      let messageType: "text" | "emoji" | "image" | "file" | "video" | "audio" = "text";
      let content: string | ArrayBuffer = message.trim();

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          const fileType = file.type.split('/')[0];  // Lấy kiểu file (image, video, etc.)
          if (fileType === "image") {
            messageType = "image";
          } else if (fileType === "video") {
            messageType = "video";
          } else if (fileType === "audio") {
            messageType = "audio";
          } else {
            messageType = "file"; // Nếu không phải hình ảnh hay video, mặc định là file
          }

          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onloadend = () => {
            content = reader.result as string;

            const newMessage: Message = {
              conversationId: selectedConversation._id,
              senderId: userDetail.userId,
              name: `${userDetail.firstname} ${userDetail.lastname}`,
              content: content,  // Gửi file dưới dạng binary data
              type: messageType,
              timestamp: new Date().toISOString(),
              isDeleted: false,
              isSentByUser: true,
              isPinned: false,
              senderAvatar: userDetail?.avatar,
              fileName: file.name,
              fileType: file.type,
            };

            socket.emit('sendMessage', newMessage);

            dispatch(addMessageToState({
              message: newMessage,
              currentUserId: userDetail.userId,
            }));
          }
        });

        setMessage('');
        setSelectedFiles([]);
      } else {
        const newMessage: Message = {
          conversationId: selectedConversation._id,
          senderId: userDetail.userId,
          type: "text", // Đây là tin nhắn văn bản
          content: message.trim(),
          timestamp: new Date().toISOString(),
          isDeleted: false,
          isPinned: false,
          senderAvatar: userDetail?.avatar,
          name: `${userDetail.firstname} ${userDetail.lastname}`,
          isSentByUser: true,
        };

        socket.emit('sendMessage', newMessage);

        dispatch(addMessageToState({
          message: newMessage,
          currentUserId: userDetail.userId,
        }));

        setMessage('');
      }

      // const newMessage = {
      //   conversationId: selectedConversation._id, // Sử dụng _id thay vì conversationId
      //   senderId: userDetail.userId, // Cập nhật với userId thực tế từ Redux
      //   name: `${userDetail.firstname} ${userDetail.lastname}`, // Tên người gửi (có thể lấy từ Redux hoặc props)
      //   content: message,
      //   type: 'text' as const,
      //   timestamp: new Date().toISOString(),
      //   isDeleted: false,
      //   isSentByUser: true,
      //   isPinned: false,
      //   senderAvatar: userDetail?.avatar, // Cập nhật với avatar thực tế từ Redux
      // };

      // // Gửi tin nhắn qua Socket.IO
      // socket.emit('sendMessage', newMessage);

      // // Thêm tin nhắn vào Redux state
      // // dispatch(addMessageToState(newMessage));
      // dispatch(addMessageToState({
      //   message: newMessage,
      //   currentUserId: userDetail.userId,
      // }));

      // setMessage(''); // Xóa nội dung sau khi gửi
    }
  };

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setEmojiPickerOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files); // Chuyển đổi files thành mảng
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]); // Thêm ảnh mới vào mảng đã có
    }
  };

  const handleRemoveFile = (fileIndex: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== fileIndex));
  };

  const handleRemoveAllFiles = () => {
    setSelectedFiles([]); // Xóa tất cả ảnh
  };

  // Xử lý khi người dùng chọn file
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files ? Array.from(e.target.files) : [];
  //   setSelectedFiles(files);
  //   const previews: string[] = [];
  //   files.forEach((file) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       previews.push(reader.result as string);
  //       if (previews.length === files.length) {
  //         setFilePreviews(previews); // Set previews once all files are read
  //       }
  //     };
  //     reader.readAsDataURL(file); // Convert files to base64 for preview
  //   });
  // };

  // const clearFile = (index: number) => {
  //   const updatedFiles = selectedFiles.filter((_, i) => i !== index);
  //   const updatedPreviews = filePreviews.filter((_, i) => i !== index);
  //   setSelectedFiles(updatedFiles);
  //   setFilePreviews(updatedPreviews);
  // };

  // const clearAllFiles = () => {
  //   setSelectedFiles([]);
  //   setFilePreviews([]);
  // };

  return (
    <div className="p-3 bg-[#282828b2] flex flex-col rounded-xl">
      <div className='p-3 bg-[#282828b2] flex items-center rounded-xl w-full'>
        {/* Nút Upload */}
        <input type="file" className="hidden" id="fileInput" multiple onChange={handleFileChange} />
        <label htmlFor="fileInput" className="cursor-pointer">
          <Upload size={20} className="text-white" />
        </label>

        {/* Input text with Emoji button inside */}
        <div className="relative flex-1 mx-2 w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
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

      
  {/* Selected Files */}
  {selectedFiles.length > 0 && (
        <div className="mt-2 flex gap-2">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                {/* Delete button inside image */}
                <button
                  className="absolute top-0 right-0 text-red-500 not-only:rounded-full p-1 cursor-pointer"
                  onClick={() => handleRemoveFile(index)}
                >
                  <Trash2 size={16} />

                </button>
              </div>
            ))}
          </div>

          {/* Button to remove all files */}
          <button
            onClick={handleRemoveAllFiles}
            className="text-red-500 text-xs cursor-pointer ml-auto"
          >
            Remove all
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatInput;