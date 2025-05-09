import React, { useEffect, useState } from 'react';
import { ConversationSidebar, ConversationDetail } from './components';
// import { addMessageToState } from '../../redux/slice/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import { resetUnreadCount, setSelectedConversation, setUnreadToZero } from '../../redux/slice/chatSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { Conversation, Member } from '../../redux/slice/types';
import socket from '../../utils/socket';
import socketCall from '../../utils/socketCall';
import { rejectedCall } from '../../redux/slice/callSlice';
import { showIncomingCall } from '../../redux/slice/incomingCallSlice';
import IncomingCallModal from './components/IncomingCallModal';
import CallModal from './components/callModal';
import { VideoRoom } from './components/VideoRoom';
import { PhoneOff } from "lucide-react";

// Define the Message type
interface Message {
  conversationId: string;
  senderId: string;
  name: string;
  content: string;
  type: string;
  timestamp: string;
  isDeleted: boolean;
  isSentByUser: boolean;
  isPinned: boolean;
  senderAvatar: string;
}
const Message: React.FC = () => {
  // const [conversations, setConversations] = useState(initialConversations);
  //   const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const conversations = useSelector((state: RootState) => state.chat.conversations);
  const selectedConversation = useSelector((state: RootState) => state.chat.selectedConversation);
  const [inVideoCall, setInVideoCall] = useState(false);
  const userDetail = useSelector((state: RootState) => state.auth.userDetail);


  useEffect(() => {
    if (user?._id) {
      socketCall.connect(); // <-- QUAN TRỌNG
      socketCall.emit('join', { userId: user._id });

      socketCall.on('incomingCall', (data) => {
        console.log("📞 incomingCall:", data);
        console.log("👤 this user:", user._id);
        if (data.toUserId === user._id) {
          dispatch(showIncomingCall({ ...data, visible: true }));
        }
      });
    }

    return () => {
      socketCall.off('incomingCall');
    };
  }, [user, dispatch]);

  useEffect(() => {
    socketCall.on("callRejected", () => {
      dispatch(rejectedCall()); // 👈 Kích hoạt trạng thái từ chối
    });

    return () => {
      socketCall.off("callRejected");
    };
  }, [dispatch]);
  const handleSelectConversation = (conversation: Conversation) => {
    if (!user) return;

    // 🔥 Join room khi chọn conversation
    socket.emit("joinRoom", conversation._id);
    const fullConversation = conversations.find((c) => c._id === conversation._id);
    if (!fullConversation) return;

    const updateConversation = {
      ...fullConversation,
      groupName: fullConversation.isGroup && fullConversation.groupName
        ? fullConversation.groupName
        : getOtherUserName(fullConversation.members),
      avatar: fullConversation.isGroup && fullConversation.avatar
        ? fullConversation.avatar
        : getOtherUserAvatar(fullConversation.members),
      unreadCount: 0,
    };


    console.log('Updated conversation:', updateConversation); // Kiểm tra cuộc trò chuyện đã cập nhật
    dispatch(setSelectedConversation(updateConversation)); // Cập nhật cuộc trò chuyện đã chọn trong Redux
    dispatch(setUnreadToZero(conversation._id));
    dispatch(resetUnreadCount({
      userId: user._id,
      conversationId: conversation._id
    }));
  };

  // Lấy tên người còn lại trong cuộc trò chuyện (không phải user hiện tại)
  const getOtherUserName = (members: Member[]) => {
    if (!user) return '';
    const otherMember = members.find((member) => member.userId !== user._id);
    return otherMember ? otherMember.name : '';
  };

  // Lấy avatar người còn lại trong cuộc trò chuyện
  const getOtherUserAvatar = (members: Member[]) => {
    if (!user) return '';
    const otherMember = members.find((member) => member.userId !== user._id);
    return otherMember ? otherMember.avatar : '';
  };

  return (
    <>
      <div className="flex h-screen">
        {/* <ConversationSidebar />
      <ConversationDetail /> */}
        <ConversationSidebar
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversation?._id || ''}
          conversations={conversations}
        />
        {/* Truyền selectedConversation vào ConversationDetail */}
        <ConversationDetail
          selectedConversation={selectedConversation}
          setInVideoCall={setInVideoCall}
        />

      </div>
      <CallModal setInVideoCall={setInVideoCall} />
      <IncomingCallModal setInVideoCall={setInVideoCall} />

      {inVideoCall && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">

          <div className="flex-1 w-full overflow-auto px-6 py-4">
            <VideoRoom />
          </div>

          <div className="w-full flex justify-center gap-6 pb-6">
            <button
              onClick={() => {
                if (selectedConversation && userDetail) {
                  const endCallMessage: Message = {
                    conversationId: selectedConversation._id,
                    senderId: userDetail.userId,
                    name: `${userDetail.firstname} ${userDetail.lastname}`,
                    content: "📞 Cuộc gọi đã kết thúc",
                    type: "text", // ✅ vẫn là text
                    timestamp: new Date().toISOString(),
                    isDeleted: false,
                    isSentByUser: true, // vì là tin do người dùng gửi
                    isPinned: false,
                    senderAvatar: userDetail.avatar,
                  };

                  socket.emit('sendMessage', endCallMessage);
                }


                setInVideoCall(false);
              }}

              className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition flex items-center justify-center"
            >
              <PhoneOff size={24} />
            </button>
          </div>

        </div>
      )}
    </>
  );
};

export default Message;
