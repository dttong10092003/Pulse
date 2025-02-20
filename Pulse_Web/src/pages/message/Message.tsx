import React, { useState } from 'react';
import { ConversationSidebar, ConversationDetail } from './components';

const conversations = [
    { id: 1, name: 'Torch', avatar: 'https://picsum.photos/200?', isOnline: true, messages: [
      { id: 1, text: 'Hello!', sender: 'Torch', isSentByUser: false },
      { id: 2, text: 'Hi there!', sender: 'User', isSentByUser: true },
    ] },
    { id: 2, name: 'TorchIT', avatar: 'https://picsum.photos/200?1', isOnline: false, messages: [
      { id: 1, text: 'Hello, how are you?', sender: 'TorchIT', isSentByUser: false },
      { id: 2, text: 'I am good, thanks!', sender: 'User', isSentByUser: true },
    ] },
  ];

// interface Conversation {
//     id: number;
//     name: string;
//     avatar: string;
//     lastMessage: string;
//     isOnline?: boolean;
// }

const Message: React.FC = () => {
    const [selectedConversation, setSelectedConversation] = useState(conversations[0]);

    const handleSelectConversation = (id: number) => {
        const conversation = conversations.find((conv) => conv.id === id);
        if (conversation) {
          setSelectedConversation(conversation); // Cập nhật state với cuộc trò chuyện đã chọn
        }
      };

  return (
    <div className="flex h-screen">
      {/* <ConversationSidebar />
      <ConversationDetail /> */}
      <ConversationSidebar onSelectConversation={handleSelectConversation} selectedConversationId={selectedConversation.id} />
       {/* Truyền selectedConversation vào ConversationDetail */}
       <ConversationDetail selectedConversation={selectedConversation} />
    </div>
  );
};

export default Message;
