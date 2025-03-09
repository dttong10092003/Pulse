import React from 'react';
import { ConversationItem } from './index';

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  isOnline?: boolean;
  isGroup: boolean;
  unreadCount: number; // ✅ Thêm unreadCount
  messages: { id: number; text: string; sender: string; isSentByUser: boolean }[];
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  onSelectConversation: (id: number) => void;
  selectedConversationId: number;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({ conversations, onSelectConversation, selectedConversationId }) => {
  return (
    <div className="w-1/4 bg-[#282828cc] h-screen p-5 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Messages</h2>
        <button className="bg-gray-700 px-2 py-1 rounded-full text-white">+</button>
      </div>
      <div className="mt-5 space-y-3">
        {conversations.map((conversation) => {
          let lastMessage = "No messages yet";

          if (conversation.messages.length > 0) {
            const lastMsg = conversation.messages[conversation.messages.length - 1];

            if (lastMsg.isSentByUser) {
              lastMessage = `You: ${lastMsg.text}`;
            } else {
              lastMessage = conversation.isGroup
                ? `${lastMsg.sender}: ${lastMsg.text}`
                : lastMsg.text;
            }
          }

          return (
            <ConversationItem
              key={conversation.id}
              conversation={{
                ...conversation,
                lastMessage,
                unreadCount: conversation.unreadCount, // ✅ Truyền unreadCount xuống
              }}
              onSelectConversation={onSelectConversation}
              isSelected={conversation.id === selectedConversationId}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ConversationSidebar;
