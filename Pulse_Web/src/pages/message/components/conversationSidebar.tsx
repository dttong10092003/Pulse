import React from 'react';
import { ConversationItem } from './index';
import { ConversationSidebarProps } from '../../../redux/slice/types';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';

// interface Message {
//   conversationId: string;
//   senderId: string;
//   name: string; // Tên người gửi (nếu là nhóm)
//   content: string;
//   timestamp: string;
//   senderAvatar: string; // Nếu là chat nhóm, mỗi tin nhắn có avatar riêng
//   isSentByUser: boolean;
//   type: string; // Loại tin nhắn (text, emoji, image, v.v.)
//   isDeleted: boolean; // Nếu tin nhắn đã bị xóa
//   isPinned: boolean; // Nếu tin nhắn đã được ghim
// }
// interface Conversation {
//   _id: string; // ID của cuộc trò chuyện
//   groupName: string;
//   avatar: string;
//   isOnline?: boolean;
//   isGroup: boolean;
//   unreadCount?: number;
//   adminId?: string; // Nếu là nhóm, ID của người quản trị nhóm
//   members: { userId: string; name: string; avatar: string }[]; // Danh sách thành viên trong nhóm
//   messages: Message[]; // Danh sách tin nhắn trong cuộc trò chuyện
//   // lastMessage?: string;
// }

// interface ConversationSidebarProps {
//   conversations: Conversation[];
//   onSelectConversation: (conversation: Conversation) => void;
//   selectedConversationId: string;
// }

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({ onSelectConversation, selectedConversationId }) => {
  const conversations = useSelector((state: RootState) => state.chat.conversations);
  // Kiểm tra conversations có dữ liệu không
  if (!conversations || conversations.length === 0) {
    return <div className="text-white">No conversations available.</div>;
  }

  return (
    <div className="w-1/4 bg-[#282828cc] h-screen p-5 text-white overflow-y-auto flex-shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Messages</h2>
        <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-white transition-colors duration-200 flex items-center justify-center h-8 w-8">+</button>
      </div>

      <div className="space-y-3">
        {conversations.map((conversation) => {
          let lastMessage = "No messages yet";

          if (conversation.messages.length > 0) {
            const lastMsg = conversation.messages[conversation.messages.length - 1];

            if (lastMsg.isSentByUser) {
              lastMessage = `You: ${lastMsg.content}`;
            } else {
              lastMessage = conversation.isGroup
                ? `${lastMsg.name}: ${lastMsg.content}`
                : lastMsg.content;
            }
          }

          return (
            <ConversationItem
              key={conversation._id}
              conversation={{
                ...conversation,
                lastMessage,
                unreadCount: conversation.unreadCount,
              }}
              onSelectConversation={onSelectConversation}
              isSelected={conversation._id === selectedConversationId}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ConversationSidebar;