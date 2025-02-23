import React from 'react';

interface ConversationItemProps {
  conversation: {
    id: number;
    name: string;
    lastMessage: string;
    avatar: string;
    isOnline?: boolean;
    unreadCount: number;
  };
  onSelectConversation: (id: number) => void;
  isSelected: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, onSelectConversation, isSelected }) => {
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer relative 
        ${isSelected ? 'bg-cyan-600/30' : 'bg-gray-700 hover:bg-gray-600'}`}
      onClick={() => onSelectConversation(conversation.id)}
    >
      {/* Avatar */}
      <div className="relative">
        <img src={conversation.avatar} alt={conversation.name} className="w-10 h-10 rounded-full" />
        
        {/* ✅ Icon online nằm trên cùng bên trái */}
        {conversation.isOnline && (
          <div className="absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full border border-gray-700"></div>
        )}
      </div>

      {/* Nội dung */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white">{conversation.name}</h3>
        <p className="text-gray-400 text-sm truncate w-[180px]">{conversation.lastMessage}</p>
      </div>

      {/* ✅ Badge tin nhắn chưa đọc nằm bên phải cạnh tên */}
      {conversation.unreadCount > 0 && (
        <div className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full text-[10px] border border-gray-700 ml-auto">
          {conversation.unreadCount}
        </div>
      )}
    </div>
  );
};

export default ConversationItem;
