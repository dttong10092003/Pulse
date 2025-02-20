import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ConversationItemProps {
  conversation: {
    id: number;
    name: string;
    lastMessage: string;
    avatar: string;
    isOnline?: boolean;
  };
  onSelectConversation: (id: number) => void;
  isSelected: boolean; // Kiểm tra xem item có được chọn không
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, onSelectConversation, isSelected }) => {
  return (
    <div
    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer 
        ${isSelected ? 'bg-cyan-600/30' : 'bg-gray-700 hover:bg-gray-600' // Thêm class bg-blue-600 khi được chọn
      }`}
      onClick={() => onSelectConversation(conversation.id)}
    >
      <img src={conversation.avatar} alt={conversation.name} className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <h3 className="text-white">{conversation.name}</h3>
        <p className="text-gray-400 text-sm">{conversation.lastMessage}</p>
      </div>
      {conversation.isOnline && <CheckCircle className="text-green-500" size={18} />}
    </div>
  );
};

export default ConversationItem;
