import React, { useState } from 'react';
import { Upload, SendHorizonal } from 'lucide-react';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  return (
    <div className="p-3 bg-[#282828b2] flex items-center">
      <input
        type="file"
        className="hidden"
        id="fileInput"
      />
      <label htmlFor="fileInput" className="cursor-pointer">
        <Upload size={20} className="text-white" />
      </label>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="w-full p-2 rounded-xl bg-[#1212124C]/50 text-white mx-2"
      />
      <button
        onClick={handleSend}
        className="ml-2 bg-green-500 px-4 py-2 rounded-lg text-white flex items-center"
      >
        <SendHorizonal size={20} />
      </button>
    </div>
  );
};

export default ChatInput;
