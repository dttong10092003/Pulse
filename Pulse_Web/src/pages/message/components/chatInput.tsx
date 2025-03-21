import React, { useState } from 'react';
import { Upload, SendHorizonal, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setEmojiPickerOpen(false);
  };

  return (
    <div className="p-3 bg-[#282828b2] flex items-center rounded-xl">
      {/* Nút Upload */}
      <input type="file" className="hidden" id="fileInput" />
      <label htmlFor="fileInput" className="cursor-pointer">
        <Upload size={20} className="text-white" />
      </label>

      {/* Input text with Emoji button inside */}
      <div className="relative flex-1 mx-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 pl-2 pr-10 rounded-xl bg-[#1212124C]/50 text-white focus:outline-none "
        />

        {/* Emoji button inside input */}
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={() => setEmojiPickerOpen(!isEmojiPickerOpen)}
        >
          <Smile size={18} className="text-white" />
        </button>

        {/* Emoji Picker */}
        {isEmojiPickerOpen && (
          <div className="absolute bottom-12 right-0 p-2 rounded-md shadow-md z-8 w-full max-w-sm overflow-hidden">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {/* Nút gửi */}
      <button
        onClick={handleSend}
        className="bg-green-500 px-4 py-2 rounded-lg text-white flex items-center cursor-pointer"
      >
        <SendHorizonal size={20} />
      </button>
    </div>
  );
};

export default ChatInput;