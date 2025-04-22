import React, { useState, useEffect, useRef } from "react";
import { ChatInput } from "./index";
import { format, formatDistanceToNow } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { deleteMessageLocal, revokeMessageLocal } from "../../../redux/slice/chatSlice";
import { Conversation, Member, Message } from '../../../redux/slice/types';
import socket from '../../../utils/socket';
import socketCall from '../../../utils/socketCall';
import GroupMembersModal from './GroupMembersModal';
import toast from 'react-hot-toast';
import ForwardMessageModal from './ForwardMessageModal';
import {
  Phone,
  Search,
  Columns2,
  Video,
  X,
  File,
  Bell,
  UserPlus,
  Pin,
  EyeOff,
  TriangleAlert,
  Trash2,
  LogOut,
  MessageCircle,
  Users,
} from "lucide-react";
import { fileIcons } from '../../../assets';
import { startCall } from '../../../redux/slice/callSlice';
import { getUserDetails } from '../../../redux/slice/userSlice';
import AddMemberModal from "./AddMemberModal";

interface ConversationDetailProps {
  selectedConversation: Conversation | null; // Thay đổi kiểu dữ liệu ở đây
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({
  selectedConversation,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  console.log("Selected conversationaaaaaa:", selectedConversation);
  console.log("ahahahha: ", selectedConversation?.messages);

  const [showForwardModal, setShowForwardModal] = useState(false);
  const [messageToForward, setMessageToForward] = useState<Message | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showGroupMembersModal, setShowGroupMembersModal] = useState(false);
  const [showMenu, setShowMenu] = useState<Message | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const dispatch = useDispatch<AppDispatch>();
  const conversations = useSelector((state: RootState) => state.chat.conversations);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const userDetails = useSelector((state: RootState) => state.user.userDetails) as {
    firstname?: string;
    lastname?: string;
    avatar?: string;
  };
  console.log("User details:", userDetails);
  const followings = useSelector((state: RootState) => state.follow.followings);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserDetails(currentUser._id));
    }
  }, [currentUser?._id, dispatch]);

  console.log("User details (full):", userDetails);
  console.log("First name:", userDetails?.firstname);
  console.log("Last name:", userDetails?.lastname);


  // const dispatch = useDispatch();
  const messages = useSelector(
    (state: RootState) => state.chat.selectedConversation?.messages
  );

  useEffect(() => {
    console.log("Messages updated:", messages); // Debugging log
  }, [messages]);

  const [showSidebar, setShowSidebar] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const toggleSwitch = () => {
    setIsToggled(!isToggled);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [selectedConversation]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (showMenu) setShowMenu(null);
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu]);

  const handleMessageRightClick = (event: React.MouseEvent, message: Message | undefined) => {
    event.preventDefault();
    if (message) {
      const bubbleWidth = 200;
      const { clientX, clientY } = event;
      const adjustedLeft = message.isSentByUser ? clientX - bubbleWidth : clientX;
      setMenuPosition({ top: clientY, left: adjustedLeft });
      setShowMenu(message); // chỉ setShowMenu nếu có messageId
    } else {
      console.warn("Message ID is undefined");
    }
  };


  if (!currentUser) {
    return <div className="text-white">Loading user...</div>;
  }

  const currentUserId = currentUser._id;

  const handleDeleteMessage = (messageId: string) => {
    socket.emit('deleteMessage', { messageId, senderId: currentUserId, conversationId: selectedConversation?._id });
    dispatch(deleteMessageLocal({ messageId }));

    setShowMenu(null); // Close menu after action
  };

  const handleRevokeMessage = (messageId: string) => {
    socket.emit('revokeMessage', { messageId, senderId: currentUserId, conversationId: selectedConversation?._id });
    dispatch(revokeMessageLocal({ messageId }));

    setShowMenu(null); // Close menu after action
  };

  const handleForwardMessage = (message: Message) => {
    console.log("🔁 Forwarding message:", message);

    setMessageToForward(message);
    setShowForwardModal(true);
  };

  const handleRemoveMember = (userId: string) => {
    console.log("Remove member:", userId);
    if (!selectedConversation) return;

    toast.custom((t) => (
      <div className="bg-[#2a2a2a] text-white p-4 rounded-lg shadow-md w-72">
        <p className="mb-2">Are you sure you want to remove this member?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              socket.emit('removeMember', {
                conversationId: selectedConversation._id,
                userIdToRemove: userId,
              });
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  const handleTransferAdmin = (newAdminId: string) => {
    console.log("Transfer admin to:", newAdminId);
    if (!selectedConversation) return;

    toast.custom((t) => (
      <div className="bg-[#2a2a2a] text-white p-4 rounded-lg shadow-md w-72">
        <p className="mb-2">Transfer admin rights to this user?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              socket.emit('transferAdmin', {
                conversationId: selectedConversation._id,
                newAdminId,
              });
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  if (!selectedConversation) {
    return (
      <div className="flex flex-col w-full items-center justify-center p-5 text-white h-screen">
        {/* Hiển thị icon hoặc hình ảnh thích hợp */}
        <MessageCircle size={200} className="text-gray-500 mb-4" />
        <p className="text-center text-lg">
          Select a conversation to start messaging.
        </p>
      </div>
    );
  }

  if (
    !selectedConversation?.messages ||
    !Array.isArray(selectedConversation.messages)
  ) {
    return <div className="p-5 text-white">No messages available.</div>;
  }

  const getFileNameFromUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const fullName = parsedUrl.pathname.split('/').pop() || 'file';
      return decodeURIComponent(fullName.split('.')[0]) + '.' + fullName.split('.').pop();
    } catch {
      return "file";
    }
  };

  const getFileIcon = (fileName: string = '') => {
    const ext = fileName.split('.').pop()?.toLowerCase();

    if (!ext) return fileIcons.doc; // fallback

    switch (ext) {
      case 'pdf':
        return fileIcons.pdf;
      case 'doc':
      case 'docx':
        return fileIcons.doc;
      case 'xls':
      case 'xlsx':
        return fileIcons.xls;
      case 'zip':
      case 'rar':
        return fileIcons.zip;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return fileIcons.image;
      case 'mp4':
      case 'mov':
      case 'avi':
        return fileIcons.video;
      case 'mp3':
      case 'wav':
        return fileIcons.sound;
      default:
        return fileIcons.doc;
    }
  };

  const allUsers: Member[] = followings.map(follow => ({
    userId: follow.user._id,
    name: `${follow.user.firstname} ${follow.user.lastname}`,
    avatar: follow.user.avatar || '',
  }));

  const handleAddMembers = (newMembers: Member[]) => {
    if (!selectedConversation) return;
    socket.emit('addMembersToGroup', {
      conversationId: selectedConversation._id,
      newMembers,
    });
  };


  return (
    <div className={`flex ${showSidebar ? "w-full" : "w-3/4"}`}>
      {/* Main chat area */}
      <div
        className={`${showSidebar ? "w-3/4" : "w-full"
          } bg-[#282828b2] h-screen flex flex-col`}
      >
        {/* Header */}
        <div className="bg-[#282828b2] p-3 text-white flex items-center justify-between">
          {/* Avatar và tên cuộc trò chuyện */}
          <div className="flex items-center gap-3">
            <img
              src={selectedConversation.avatar}
              alt={selectedConversation.groupName}
              className="w-10 h-10 rounded-full mr-3"
            />
            <h3 className="font-bold text-lg">
              {selectedConversation.groupName}
            </h3>
          </div>

          {/* Các icon bên phải */}
          <div className="flex items-center gap-4">
            <Phone
              size={20}
              className="text-white cursor-pointer hover:text-gray-400 transition duration-200"
              onClick={() => {
                if (!selectedConversation || !currentUser) return;

                const isGroup = selectedConversation.isGroup;

                const calleeName = isGroup
                  ? selectedConversation.groupName
                  : selectedConversation.members.find(m => m.userId !== currentUser._id)?.name || "Unknown";

                const calleeAvatar = isGroup
                  ? selectedConversation.avatar
                  : selectedConversation.members.find(m => m.userId !== currentUser._id)?.avatar || "";

                dispatch(startCall({
                  isVideo: false,
                  calleeName,
                  calleeAvatar,
                  toUserId: selectedConversation.members.find(m => m.userId !== currentUser._id)?.userId,
                  fromUserId: currentUser._id,
                  fromName: `${userDetails?.firstname || ''} ${userDetails?.lastname || ''}`,
                  fromAvatar: userDetails?.avatar || '',
                  isGroup,
                  groupName: selectedConversation.groupName,
                }));


                if (isGroup) {
                  selectedConversation.members.forEach(member => {
                    if (member.userId !== currentUser._id) {
                      socketCall.emit("incomingCall", {
                        toUserId: member.userId,
                        fromUserId: currentUser._id,
                        fromName: `${userDetails?.firstname || ''} ${userDetails?.lastname || ''}`,
                        fromAvatar: userDetails?.avatar || "",
                        isVideo: false,
                        isGroup: true,
                        groupName: selectedConversation.groupName,
                        groupAvatar: selectedConversation.avatar,
                      });
                    }
                  });
                } else {
                  const toUserId = selectedConversation.members.find(m => m.userId !== currentUser._id)?.userId;
                  if (toUserId) {
                    socketCall.emit("incomingCall", {
                      toUserId,
                      fromUserId: currentUser._id,
                      fromName: `${userDetails?.firstname || ''} ${userDetails?.lastname || ''}`,
                      fromAvatar: userDetails?.avatar || "",
                      isVideo: false,
                      isGroup: false,
                    });
                  }
                }
              }}
            />

            <Video
              size={20}
              className="text-white cursor-pointer hover:text-gray-400 transition duration-200"
              onClick={() => {
                if (!selectedConversation || !currentUser) return;

                const isGroup = selectedConversation.isGroup;

                const calleeName = isGroup
                  ? selectedConversation.groupName
                  : selectedConversation.members.find(m => m.userId !== currentUser._id)?.name || "Unknown";

                const calleeAvatar = isGroup
                  ? selectedConversation.avatar
                  : selectedConversation.members.find(m => m.userId !== currentUser._id)?.avatar || "";

                const toUserId = selectedConversation.members.find(m => m.userId !== currentUser._id)?.userId;

                dispatch(startCall({
                  isVideo: false,
                  calleeName,
                  calleeAvatar,
                  toUserId,
                  fromUserId: currentUser._id,
                  fromName: `${userDetails?.firstname || ''} ${userDetails?.lastname || ''}`,
                  fromAvatar: userDetails?.avatar || '',
                  isGroup,
                  groupName: selectedConversation.groupName,
                }));


                if (isGroup) {
                  selectedConversation.members.forEach(member => {
                    if (member.userId !== currentUser._id) {
                      socketCall.emit("incomingCall", {
                        toUserId: member.userId,
                        fromUserId: currentUser._id,
                        fromName: `${userDetails?.firstname || ''} ${userDetails?.lastname || ''}`,
                        fromAvatar: userDetails?.avatar || "",
                        isVideo: true,
                        isGroup: true,
                        groupName: selectedConversation.groupName,
                        groupAvatar: selectedConversation.avatar,
                      });
                    }
                  });
                } else {
                  const toUserId = selectedConversation.members.find(m => m.userId !== currentUser._id)?.userId;
                  if (toUserId) {
                    socketCall.emit("incomingCall", {
                      toUserId,
                      fromUserId: currentUser._id,
                      fromName: `${userDetails?.firstname || ''} ${userDetails?.lastname || ''}`,
                      fromAvatar: userDetails?.avatar || "",
                      isVideo: true,
                      isGroup: false,
                    });
                  }
                }
              }}
            />




            <Search
              size={20}
              className="text-white cursor-pointer hover:text-gray-400 transition duration-200"
            />
            <Columns2
              size={20}
              className={`cursor-pointer transition duration-200 ${showSidebar
                ? "text-green-400"
                : "text-white hover:text-gray-400"
                }`}
              onClick={toggleSidebar}
            />
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages?.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${msg.isSentByUser ? "flex-row-reverse" : ""
                }`}
            >
              {/* Nếu là tin nhắn của người khác, hiển thị avatar */}
              {!msg.isSentByUser && (
                <img
                  src={
                    selectedConversation.isGroup
                      ? msg.senderAvatar
                      : selectedConversation.avatar
                  }
                  alt={msg.senderId}
                  className="w-8 h-8 rounded-full"
                />
              )}

              <div className="flex flex-col max-w-[70%]">
                {/* Nếu là chat nhóm, hiển thị tên người gửi (trừ tin nhắn của user) */}
                {!msg.isSentByUser && selectedConversation.isGroup && (
                  <p className="text-xs text-gray-400 mb-1">{msg.name}</p>
                )}

                {/* <div
                  className={`p-3 rounded-lg text-white ${msg.isSentByUser ? "bg-green-600" : "bg-gray-600"
                    } break-words`}
                >
                  {msg.content}
                </div> */}

                <div className={`p-3 rounded-lg text-white ${msg.isSentByUser ? "bg-green-600" : "bg-gray-600"} break-words`}
                  onContextMenu={(event) => handleMessageRightClick(event, msg)}
                >
                  {/* Kiểm tra nếu msg.content là string */}
                  {typeof msg.content === 'string' ? (
                    msg.type === "image" ? (
                      <img
                        src={typeof msg.content === 'string' ? msg.content : URL.createObjectURL(new Blob([msg.content]))}
                        alt="Image message"
                        className="w-full max-h-[499px] object-cover rounded-lg"
                      />
                    ) : msg.type === "file" || msg.type === "video" || msg.type === "audio" ? (
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow text-black max-w-[300px]">
                        <img
                          src={getFileIcon(msg.fileName || getFileNameFromUrl(msg.content))}
                          alt="file-icon"
                          className="w-10 h-10 object-contain"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium text-sm">
                            {msg.fileName || getFileNameFromUrl(msg.content)}
                          </p>
                          <a
                            href={msg.content as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={msg.fileName}
                            className="text-xs text-gray-600 hover:text-black"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )
                  ) : (
                    <p>Invalid content type</p> // Trường hợp nếu không phải string
                  )}
                </div>

                {/* Hiển thị thời gian */}
                <p
                  className={`text-xs text-gray-400 mt-1 ${msg.isSentByUser ? "text-right" : ""
                    }`}
                >
                  {/* {
                    new Date(msg.timestamp).getTime() > Date.now() - 86400000
                      ? formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })
                      : format(new Date(msg.timestamp), 'MMM dd, yyyy')  // Định dạng ngày tháng
                  } */}

                  {
                    // Kiểm tra nếu tin nhắn trong 24 giờ qua
                    new Date(msg.timestamp).getTime() > Date.now() - 86400000
                      ? formatDistanceToNow(new Date(msg.timestamp), {
                        addSuffix: true,
                      }) // "vài phút trước", "1 giờ trước"
                      : format(new Date(msg.timestamp), "MMM dd, yyyy HH:mm") // "Apr 02, 2025 14:35"
                  }
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput />
      </div>

      {/* Menu context */}
      {showMenu && (
        <div
          className="absolute bg-gray-800 text-white p-2 rounded-lg shadow-lg"
          style={{ top: menuPosition.top, left: menuPosition.left, zIndex: 999 }}
        >
          {showMenu.senderId === currentUserId && (
            <>
              <div onClick={() => handleDeleteMessage(showMenu._id!)} className="cursor-pointer p-1 hover:bg-gray-700">
                Delete Message
              </div>
              <div onClick={() => handleRevokeMessage(showMenu._id!)} className="cursor-pointer p-1 hover:bg-gray-700">
                Revoke Message
              </div>
            </>
          )}
          {/* 👉 Luôn hiển thị với mọi tin nhắn */}
          <div
            onClick={() => handleForwardMessage(showMenu)}
            className="cursor-pointer p-1 hover:bg-gray-700"
          >
            Forward Message
          </div>
        </div>
      )}

      {/* Right Sidebar */}
      {showSidebar && (
        <div
          className="w-1/3 bg-[#1e1e1e] h-screen flex flex-col border-l border-gray-700"
          style={{
            scrollbarWidth: "thin", // Dạng thanh cuộn nhỏ
            scrollbarColor: "#4b5563 #1e1e1e", // Màu thanh cuộn và track
          }}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-white font-medium">Detailed information</h3>
            <X
              size={18}
              className="text-gray-400 cursor-pointer hover:text-white"
              onClick={toggleSidebar}
            />
          </div>

          {/* Conversation Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex flex-col items-center mb-4">
              <img
                src={selectedConversation.avatar}
                alt={selectedConversation.groupName}
                className="w-20 h-20 rounded-full mb-2"
              />
              <h2 className="text-white font-bold text-lg">
                {selectedConversation.groupName}
              </h2>
              {selectedConversation.isGroup && (
                <p className="text-gray-400 text-sm">
                  Group · {selectedConversation.messages?.length} message
                </p>
              )}
            </div>

            <div className="flex justify-around mb-2">
              <div className="flex flex-col items-center text-gray-300 cursor-pointer hover:text-white">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mb-1">
                  <Bell size={16} />
                </div>
                <span className="text-xs text-center">
                  Turn off
                  <br /> <span className="centered-text">notifications</span>
                </span>
              </div>
              <div className="flex flex-col items-center text-gray-300 cursor-pointer hover:text-white">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mb-1">
                  <Pin size={16} />
                </div>
                <span className="text-xs text-center">
                  Pin
                  <br /> <span className="centered-text">message</span>
                </span>{" "}
              </div>
              <div className="flex flex-col items-center text-gray-300 cursor-pointer hover:text-white">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mb-1"
                  onClick={() => setShowAddMemberModal(true)}
                >
                  <UserPlus size={16} />
                </div>
                <span className="text-xs text-center">
                  Add
                  <br /> <span className="centered-text">member</span>
                </span>
              </div>
            </div>
          </div>

          {/* Nút xem thành viên nhóm */}
          {selectedConversation.isGroup && (
            <button
              onClick={() => setShowGroupMembersModal(true)}
              className="flex items-center gap-1 hover:text-green-400 cursor-pointer p-4 border-b border-gray-700 text-gray-300"
            >
              <Users size={18} /> Members ({selectedConversation.members.length})

            </button>
          )}

          {selectedConversation.isGroup && showGroupMembersModal && (
            <GroupMembersModal
              members={selectedConversation.members}
              adminId={selectedConversation.adminId || ''}
              onClose={() => setShowGroupMembersModal(false)}
              onRemoveMember={handleRemoveMember}
              onTransferAdmin={handleTransferAdmin}
            />
          )}

          {selectedConversation?.isGroup && showAddMemberModal && (
            <AddMemberModal
              membersInGroup={selectedConversation.members}
              allUsers={allUsers}
              onClose={() => setShowAddMemberModal(false)}
              onAddMembers={handleAddMembers}
            />
          )}

          {/* Shared Content Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-gray-700">
              <h4 className="text-white font-medium mb-3">Image/Video</h4>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="aspect-square bg-gray-700 rounded-md overflow-hidden"
                  >
                    <img
                      src={`https://picsum.photos/200`}
                      alt="placeholder"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <button className="text-green-500 text-sm font-medium mt-2 hover:text-green-400 cursor-pointer">
                Xem tất cả
              </button>
            </div>

            <div className="p-4 border-b border-gray-700">
              <h4 className="text-white font-medium mb-3">File</h4>
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="bg-gray-800 p-2 rounded-md flex items-center"
                  >
                    <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center mr-2">
                      <File size={16} className="text-gray-400" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-white text-sm truncate">
                        document-{item}.pdf
                      </p>
                      <p className="text-gray-400 text-xs">15/03/2025</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-green-500 text-sm font-medium mt-2 hover:text-green-400 cursor-pointer">
                Xem tất cả
              </button>
            </div>

            <div className="p-4">
              <h4 className="text-white font-medium mb-3">Options</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-white cursor-pointer hover:bg-gray-800 p-2 rounded-md">
                  <div className="flex items-center">
                    <EyeOff size={16} className="mr-2" />
                    <span>Hide chat</span>
                  </div>
                  <div
                    onClick={toggleSwitch}
                    className={`w-12 h-6 bg-gray-700 rounded-full flex items-center p-1 cursor-pointer ${isToggled ? "bg-green-700" : "bg-gray-700"
                      }`}
                  >
                    {/* Toggle circle */}
                    <div
                      className={`w-4 h-4 bg-gray-400 rounded-full transition-transform transform ${isToggled ? "translate-x-6" : ""
                        }`}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-white cursor-pointer hover:bg-gray-800 p-2 rounded-md">
                  <div className="flex items-center">
                    <TriangleAlert size={16} className="mr-2" />
                    <span>Report</span>
                  </div>
                </div>

                <div className="flex items-center text-white cursor-pointer hover:bg-gray-800 p-2 rounded-md">
                  <Trash2 size={16} className="mr-2 text-red-500" />
                  <span className="text-red-500">Delete chat</span>
                </div>
                {/* Nếu đang ở nhóm chat thì có thêm ntu1 này */}
                {selectedConversation.isGroup && (
                  <div className="flex items-center text-white cursor-pointer hover:bg-gray-800 p-2 rounded-md">
                    <LogOut size={16} className="mr-2 text-red-500" />
                    <span className="text-red-500">Leave the group</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showForwardModal && messageToForward && (
        <ForwardMessageModal
          message={messageToForward}
          conversations={conversations.filter(
            (conv) => conv._id !== selectedConversation?._id // ẩn cuộc trò chuyện hiện tại
          )}
          onClose={() => setShowForwardModal(false)}
          onForward={(message, toConversationIds) => {
            toConversationIds.forEach((convId) => {
              socket.emit("sendMessage", {
                conversationId: convId,
                senderId: currentUserId,
                name: `${userDetails?.firstname || ''} ${userDetails?.lastname || ''}`,
                senderAvatar: userDetails?.avatar || "",
                content: message.content,
                type: message.type,
                timestamp: new Date().toISOString(),
                isDeleted: false,
                isSentByUser: true,
                isPinned: false,
                fileName: message.fileName || '',
                fileType: message.fileType || '',
              });
            });

            toast.success("Message forwarded successfully");
            setShowForwardModal(false);
            setMessageToForward(null);
          }}
        />
      )}
    </div>
  );
};

export default ConversationDetail;
