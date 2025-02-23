import React, { useState } from 'react';
import { ConversationSidebar, ConversationDetail } from './components';

const initialConversations  = [
  {
    id: 1,
    name: 'Torch',
    avatar: 'https://picsum.photos/200?2', // Avatar chung của người đối diện
    isOnline: false,
    isGroup: false, // Chat riêng
    unreadCount: 0,
    messages: [
      { id: 1, text: 'Hello!', sender: 'Torch', isSentByUser: false, timestamp: '10:00 AM' },
      { id: 2, text: 'Hi there!', sender: 'You', isSentByUser: true, timestamp: '10:02 AM' },
      { id: 3, text: 'How are yoqweqaaaaaeqweqwewq qweqwe eqweqwequ?', sender: 'Torch', isSentByUser: false, timestamp: '10:05 AM' },
    ],
  },
  {
    id: 2,
    name: 'Developers Group',
    avatar: 'https://picsum.photos/200?group', // Avatar của nhóm
    isOnline: true,
    isGroup: true, // Chat nhóm
    unreadCount: 2,
    messages: [
      { id: 1, text: 'Hello, hào các bạn, sau một thời gian dài bận bịu với các dự án sử dụng các công nghệ cũ, hoặc các công nghệ do khách hàng chọn lựa từ trước, mình bỗng nhiên ngỡ ngàng khi nghe phong phanh dự án mới sẽ làm theo kiến trúc Microservices. Dù cũng có tương đối kinh nghiệm làm việc nhưng thời điểm đó mình cũng chưa hình dung ra Microservices là cái quái gì?, chúng ta cần phải xây dựng ứng dụng như thế nào?, ... Bắt tay vào tìm hiểu, và điều đầu tiên mình nhận ra rằng -> làm mãi với những công nghệ từ thập kỉ trước không thể làm bản thân tiến bộ được (Note: dự án mình làm gần đây nhất sử dụng các công nghệ java từ những năm 2004 @@), công nghệ đã và đang thay đổi hàng ngày, nếu cứ bảo thủ và không chịu cập nhật thì chúng ta chỉ bước những bước lùi mà thôi.', sender: 'Alice', senderAvatar: 'https://picsum.photos/200?4', isSentByUser: false, timestamp: '09:30 AM' },
      { id: 2, text: 'Hey Alice!', sender: 'Bob', senderAvatar: 'https://picsum.photos/200?5', isSentByUser: false, timestamp: '09:32 AM' },
      { id: 3, text: 'Good morning!', sender: 'You', isSentByUser: true, timestamp: '09:35 AM' },
      { id: 4, text: 'Hey Alice!', sender: 'Bob', senderAvatar: 'https://picsum.photos/200?5', isSentByUser: false, timestamp: '09:40 AM' },
      { id: 5, text: 'A Đàm!', sender: 'AWW', senderAvatar: 'https://picsum.photos/200?5', isSentByUser: false, timestamp: '09:41 AM' },
      { id: 6, text: 'A nè', sender: 'mr.đàm', senderAvatar: 'https://picsum.photos/200?5', isSentByUser: false, timestamp: '09:41 AM' },

    ],
  },
  {
    id: 3,
    name: 'Game Group',
    avatar: 'https://picsum.photos/200?group1', // Avatar của nhóm
    isOnline: true,
    isGroup: true,
    unreadCount: 1,
    messages: [
      { id: 1, text: 'Hello, hào các bạn, sau một thời gian dài bận bịu với các dự án sử dụng các công nghệ cũ, hoặc các công nghệ do khách hàng chọn lựa từ trước, mình bỗng nhiên ngỡ ngàng khi nghe phong phanh dự án mới sẽ làm theo kiến trúc Microservices. Dù cũng có tương đối kinh nghiệm làm việc nhưng thời điểm đó mình cũng chưa hình dung ra Microservices là cái quái gì?, chúng ta cần phải xây dựng ứng dụng như thế nào?, ... Bắt tay vào tìm hiểu, và điều đầu tiên mình nhận ra rằng -> làm mãi với những công nghệ từ thập kỉ trước không thể làm bản thân tiến bộ được (Note: dự án mình làm gần đây nhất sử dụng các công nghệ java từ những năm 2004 @@), công nghệ đã và đang thay đổi hàng ngày, nếu cứ bảo thủ và không chịu cập nhật thì chúng ta chỉ bước những bước lùi mà thôi.', sender: 'Alice', senderAvatar: 'https://picsum.photos/200?4', isSentByUser: false, timestamp: '09:30 AM' },
      { id: 2, text: 'Hey Alice!', sender: 'Bob', senderAvatar: 'https://picsum.photos/200?5', isSentByUser: false, timestamp: '09:32 AM' },
      { id: 3, text: 'Good morning!', sender: 'You', isSentByUser: true, timestamp: '09:35 AM' }, 
      { id: 4, text: 'Good morning asdsadsadasdadasd!', sender: 'Nana', senderAvatar: 'https://picsum.photos/200?5', isSentByUser: false, timestamp: '09:38 AM' }, 
    ],
  },
];




const Message: React.FC = () => {
  const [conversations, setConversations] = useState(initialConversations);
    const [selectedConversation, setSelectedConversation] = useState(conversations[0]);

    const handleSelectConversation = (id: number) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === id ? { ...conv, unreadCount: 0 } : conv // ✅ Đánh dấu là đã đọc
        )
      );
  
      const conversation = conversations.find((conv) => conv.id === id);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    };

  return (
    <div className="flex h-screen">
      {/* <ConversationSidebar />
      <ConversationDetail /> */}
      <ConversationSidebar 
        onSelectConversation={handleSelectConversation} 
        selectedConversationId={selectedConversation.id} 
        conversations={conversations} 
      />
       {/* Truyền selectedConversation vào ConversationDetail */}
       <ConversationDetail selectedConversation={selectedConversation} />
    </div>
  );
};

export default Message;
