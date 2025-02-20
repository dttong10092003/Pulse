import React from 'react';
import { ChatInput } from './index';

interface ConversationDetailProps {
  selectedConversation: {
    name: string;
    avatar: string;
    messages: { id: number; text: string; sender: string; isSentByUser: boolean }[];
  };
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ selectedConversation }) => {
  return (
    <div className="w-3/4 bg-gray-700 h-screen flex flex-col">
      <div className="bg-gray-800 p-3 text-white flex items-center">
        <img src={selectedConversation.avatar} alt={selectedConversation.name} className="w-10 h-10 rounded-full mr-3" />
        <h3 className="font-bold">{selectedConversation.name}</h3>
      </div>

      {/* Chat Content */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {selectedConversation.messages.map((msg) => (
          <div key={msg.id} className={`flex items-center gap-3 ${msg.isSentByUser ? 'justify-end' : ''}`}>
            <div className={`p-3 rounded-lg text-white ${msg.isSentByUser ? 'bg-green-600' : 'bg-gray-600'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <ChatInput />
    </div>
  );
};

export default ConversationDetail;