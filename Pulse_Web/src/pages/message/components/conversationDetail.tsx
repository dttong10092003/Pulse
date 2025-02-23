import React from 'react';
import { ChatInput } from './index';

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
  return (
    <div className="w-3/4 bg-[#282828b2] h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#282828b2] p-3 text-white flex items-center">
        <img src={selectedConversation.avatar} alt={selectedConversation.name} className="w-10 h-10 rounded-full mr-3" />
        <h3 className="font-bold">{selectedConversation.name}</h3>
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
  );
};

export default ConversationDetail;
