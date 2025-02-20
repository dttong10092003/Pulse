import React from 'react';
import ConversationItem from './conversationItem';

const conversations = [
  { id: 1, name: 'Torch', lastMessage: 'Hello', avatar: 'https://picsum.photos/200?', isOnline: true },
  { id: 2, name: 'TorchIT', lastMessage: 'Hello', avatar: 'https://picsum.photos/200?1', isOnline: false },
];

interface ConversationSidebarProps {
  onSelectConversation: (id: number) => void;
  selectedConversationId: number;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({ onSelectConversation, selectedConversationId }) => {
  return (
    <div className="w-1/4 bg-gray-800 h-screen p-5 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Messages</h2>
        <button className="bg-gray-700 px-2 py-1 rounded-full text-white">+</button>
      </div>
      <div className="mt-5 space-y-3">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onSelectConversation={onSelectConversation}
            isSelected={conversation.id === selectedConversationId}
          />
        ))}
      </div>
    </div>
  );
};

export default ConversationSidebar;
