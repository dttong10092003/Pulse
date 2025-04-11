import React, { useState, useEffect, useRef } from 'react';
import { ConversationItem } from './index';
import { ConversationSidebarProps } from '../../../redux/slice/types';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { Search, MoreVertical, Users } from 'lucide-react';
import CreateGroupModal from './CreateGroupModal';

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({ onSelectConversation, selectedConversationId }) => {
  const conversations = useSelector((state: RootState) => state.chat.conversations);

  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getOtherUserName = (members: { userId: string; name: string }[]): string => {
    const otherMember = members.find((member) => member.userId !== currentUserId);
    return otherMember ? otherMember.name : '';
  };

  const followedUsers = conversations.filter(c => !c.isGroup);

  const filteredConversations = conversations.filter((conversation) => {
    const target = conversation.isGroup
      ? conversation.groupName
      : getOtherUserName(conversation.members);
    return target.toLowerCase().includes(searchTerm.toLowerCase().trim());
  });

  const allUsers = Array.from(
    new Map(
      conversations
        .flatMap(c => c.members)
        .filter(m => m.userId !== currentUserId)
        .map(m => [m.userId, m])
    ).values()
  );



  // Kiểm tra conversations có dữ liệu không
  if (!conversations || conversations.length === 0) {
    return <div className="text-white">No conversations available.</div>;
  }

  return (
    <>
    {showCreateGroup && (
        <CreateGroupModal
          users={allUsers}
          onClose={() => setShowCreateGroup(false)}
          onCreate={(name, members, avatar) => {
            console.log('Tạo nhóm với:', name, members, avatar);
            setShowCreateGroup(false);
          }}
        />
      )}

    <div className="w-1/4 bg-[#282828cc] h-screen p-5 text-white overflow-y-auto flex-shrink-0">
      {/* <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Messages</h2>
        <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-white transition-colors duration-200 flex items-center justify-center h-8 w-8">+</button>
      </div> */}

      {/* Menu ngang: danh sách user đã follow */}
      <div className="flex space-x-4 overflow-x-auto mb-4 pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {followedUsers.map((user) => (
          <div key={user._id} className="flex flex-col items-center min-w-[60px]">
            <img src={user.avatar} alt={user.groupName} className="w-10 h-10 rounded-full cursor-pointer" />
            <p className="text-xs mt-1 truncate text-center">{user.groupName}</p>
          </div>
        ))}
      </div>

      {/* Thanh tìm kiếm và nút menu */}
      <div className="flex items-center justify-between mb-4 space-x-2">
        <div className="flex items-center bg-gray-700 rounded-full px-3 py-2 flex-1">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="bg-transparent w-full text-sm text-white placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full text-white ml-1 cursor-pointer"
          >
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 bg-gray-800 rounded-md shadow-md w-44 z-10 p-2">
              <div onClick={() =>{
                setShowCreateGroup(true);
                setShowMenu(false);
              }} 
              className="text-white px-2 py-1 hover:bg-gray-700 rounded cursor-pointer flex items-center">
                <Users size={14} className="mr-2" /> Tạo nhóm
              </div>
              {/* Add more options here if needed */}
            </div>
          )}
        </div>
      </div>


      <div className="space-y-3">
        {filteredConversations.map((conversation) => {
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
    </>
  );
};

export default ConversationSidebar;