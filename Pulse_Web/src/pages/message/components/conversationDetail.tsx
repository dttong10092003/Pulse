import React, { useState } from 'react';
import { ChatInput } from './index';
import { Phone, Search, Columns2, Video, X, File, Bell, UserPlus, Pin, EyeOff, TriangleAlert, Trash2, LogOut } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: string;
  senderAvatar?: string; // Nếu là chat nhóm, mỗi tin nhắn có avatar riêng
  isSentByUser: boolean;
  timestamp: string;
}

interface ConversationDetailProps {
  selectedConversation: {
    name: string;
    avatar: string; // Avatar chung nếu là chat riêng
    isGroup: boolean;
    messages: Message[];
  };
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ selectedConversation }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const toggleSwitch = () => {
    setIsToggled(!isToggled);
  };
  return (
    <div className="w-full h-screen flex">
      {/* Main Chat Container */}
      <div className={`${showSidebar ? 'w-2/3' : 'w-full'} bg-[#282828b2] flex flex-col transition-all duration-300`}>
        {/* Header */}
        <div className="bg-[#282828b2] p-3 text-white flex items-center justify-between">
          {/* Avatar và tên cuộc trò chuyện */}
          <div className="flex items-center gap-3">
            <img
              src={selectedConversation.avatar}
              alt={selectedConversation.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <h3 className="font-bold text-lg">{selectedConversation.name}</h3>
          </div>

          {/* Các icon bên phải */}
          <div className="flex items-center gap-4">
            <Phone size={20} className="text-white cursor-pointer hover:text-gray-400 transition duration-200" />
            <Video size={20} className="text-white cursor-pointer hover:text-gray-400 transition duration-200" />
            <Search size={20} className="text-white cursor-pointer hover:text-gray-400 transition duration-200" />
            <Columns2
              size={20}
              className={`cursor-pointer transition duration-200 ${showSidebar ? 'text-green-400' : 'text-white hover:text-gray-400'}`}
              onClick={toggleSidebar}
            />
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {selectedConversation.messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.isSentByUser ? 'flex-row-reverse' : ''}`}>
              {/* Nếu là tin nhắn của người khác, hiển thị avatar */}
              {!msg.isSentByUser && (
                <img
                  src={selectedConversation.isGroup ? msg.senderAvatar : selectedConversation.avatar}
                  alt={msg.sender}
                  className="w-8 h-8 rounded-full"
                />
              )}

              <div className="flex flex-col max-w-[70%]">
                {/* Nếu là chat nhóm, hiển thị tên người gửi (trừ tin nhắn của user) */}
                {!msg.isSentByUser && selectedConversation.isGroup && (
                  <p className="text-xs text-gray-400 mb-1">{msg.sender}</p>
                )}

                <div className={`p-3 rounded-lg text-white ${msg.isSentByUser ? 'bg-green-600' : 'bg-gray-600'} break-words`}>
                  {msg.text}
                </div>

                {/* Hiển thị thời gian */}
                <p className={`text-xs text-gray-400 mt-1 ${msg.isSentByUser ? 'text-right' : ''}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        <ChatInput />
      </div>

      {/* Right Sidebar */}
      {showSidebar && (
        <div className="w-1/3 bg-[#1e1e1e] h-screen flex flex-col border-l border-gray-700"
          style={{
            scrollbarWidth: "thin",  // Dạng thanh cuộn nhỏ
            scrollbarColor: "#4b5563 #1e1e1e",  // Màu thanh cuộn và track
          }}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-white font-medium">Detailed information</h3>
            <X
              size={18}
              className="text-gray-400 cursor-pointer hover:text-white"
              onClick={toggleSidebar}
            />
          </div>

          {/* Conversation Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex flex-col items-center mb-4">
              <img
                src={selectedConversation.avatar}
                alt={selectedConversation.name}
                className="w-20 h-20 rounded-full mb-2"
              />
              <h2 className="text-white font-bold text-lg">{selectedConversation.name}</h2>
              {selectedConversation.isGroup && (
                <p className="text-gray-400 text-sm">Group · {selectedConversation.messages.length} message</p>
              )}
            </div>

            <div className="flex justify-around mb-2">
              <div className="flex flex-col items-center text-gray-300 cursor-pointer hover:text-white">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mb-1">
                  <Bell size={16} />
                </div>
                <span className="text-xs text-center">
                  Turn off<br /> <span className="centered-text">notifications</span>
                </span>
              </div>
              <div className="flex flex-col items-center text-gray-300 cursor-pointer hover:text-white">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mb-1">
                  <Pin size={16} />
                </div>
                <span className="text-xs text-center">
                  Pin<br /> <span className="centered-text">message</span>
                </span>              </div>
              <div className="flex flex-col items-center text-gray-300 cursor-pointer hover:text-white">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mb-1">
                  <UserPlus size={16} />
                </div>
                <span className="text-xs text-center">
                  Create<br /> <span className="centered-text">chat group</span>
                </span>
              </div>
            </div>
          </div>

          {/* Shared Content Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-gray-700">
              <h4 className="text-white font-medium mb-3">Image/Video</h4>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="aspect-square bg-gray-700 rounded-md overflow-hidden">
                    <img src={`https://picsum.photos/200`} alt="placeholder" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <button className="text-green-500 text-sm font-medium mt-2 hover:text-green-400 cursor-pointer">
                Xem tất cả
              </button>
            </div>

            <div className="p-4 border-b border-gray-700">
              <h4 className="text-white font-medium mb-3">File</h4>
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-gray-800 p-2 rounded-md flex items-center">
                    <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center mr-2">
                      <File size={16} className="text-gray-400" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-white text-sm truncate">document-{item}.pdf</p>
                      <p className="text-gray-400 text-xs">15/03/2025</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-green-500 text-sm font-medium mt-2 hover:text-green-400 cursor-pointer">
                Xem tất cả
              </button>
            </div>

            <div className="p-4">
              <h4 className="text-white font-medium mb-3">Options</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-white cursor-pointer hover:bg-gray-800 p-2 rounded-md">
                  <div className="flex items-center">
                    <EyeOff size={16} className="mr-2" />
                    <span>Hide chat</span>
                  </div>
                  <div
                    onClick={toggleSwitch}
                    className={`w-12 h-6 bg-gray-700 rounded-full flex items-center p-1 cursor-pointer ${isToggled ? 'bg-green-7  00' : 'bg-gray-700'}`}
                  >
                    {/* Toggle circle */}
                    <div
                      className={`w-4 h-4 bg-gray-400 rounded-full transition-transform transform ${isToggled ? 'translate-x-6' : ''}`}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-white cursor-pointer hover:bg-gray-800 p-2 rounded-md">
                  <div className="flex items-center">
                    <TriangleAlert size={16} className="mr-2" />
                    <span>Report</span>
                  </div>

                </div>

                <div className="flex items-center text-white cursor-pointer hover:bg-gray-800 p-2 rounded-md">
                  <Trash2 size={16} className="mr-2 text-red-500" />
                  <span className="text-red-500">Delete chat</span>
                </div>
                {/* Nếu đang ở nhóm chat thì có thêm ntu1 này */}
                {selectedConversation.isGroup && (
                  <div className="flex items-center text-white cursor-pointer hover:bg-gray-800 p-2 rounded-md">
                    <LogOut size={16} className="mr-2 text-red-500" />
                    <span className="text-red-500">Leave the group</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationDetail;