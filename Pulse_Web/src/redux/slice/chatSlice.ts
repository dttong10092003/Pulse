import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { Conversation, Message } from './types';

const CHAT_SERVICE_URL = 'http://localhost:3000/chat';


// Define the state for Chat
interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  onlineUsers: string[]; // List of online users
  selectedConversation: Conversation | null; // Cuộc trò chuyện đã chọn
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  messages: [],
  onlineUsers: [],
  selectedConversation: null,
  loading: false,
  error: null,
};

export const getAllConversations = createAsyncThunk(
  'chat/getAllConversations',
  async (userId: string, { getState, rejectWithValue }) => {
    console.log('Fetching all conversations for user:', userId);
    const token = (getState() as RootState).auth?.token; // Lấy token từ Redux store
    console.log('Tokencccccccccccccccccccccccccccccccccccccc:', token); // Debugging log
    if (!token) {
      console.error('No token found in state');
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(`${CHAT_SERVICE_URL}/conversations/all/${userId}`, {
        headers: { Authorization: `${token}` },
      });
      // const response = await axios.get(`${CHAT_SERVICE_URL}/conversations/all/${userId}`);

      console.log('Fetched conversations:', response.data);
      return response.data || []; // Trả về danh sách cuộc trò chuyện
    } catch (error) {
      console.error('Error getting all conversations:', error);
      return rejectWithValue('Failed to get all conversations');
    }
  }
);

// 1️⃣ Kiểm tra trạng thái online của người dùng
export const checkUserOnline = createAsyncThunk(
  'chat/checkUserOnline',
  async (userId: string, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token; // Lấy token từ Redux store
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(`${CHAT_SERVICE_URL}/conversations/online/${userId}`, {
        headers: { Authorization: `${token}` },
      });
      return { userId, online: response.data.online }; // Trả về trạng thái online
    } catch (error) {
      console.error('Error checking user online status:', error);
      return rejectWithValue('Failed to check user online status');
    }
  }
);

// 2️⃣ Tạo hoặc lấy cuộc trò chuyện riêng tư
export const createOrGetPrivateConversation = createAsyncThunk(
  'chat/createOrGetPrivateConversation',
  async ({ user1, user2, user2Name, user2Avatar }: { user1: string; user2: string; user2Name: string, user2Avatar: string }, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.post(
        `${CHAT_SERVICE_URL}/conversations/private`,
        { user1, user2, user2Name, user2Avatar },
        { headers: { Authorization: `${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating or getting private conversation:', error);
      return rejectWithValue('Failed to create or get private conversation');
    }
  }
);

// 3️⃣ Tạo nhóm chat
export const createGroupConversation = createAsyncThunk(
  'chat/createGroupConversation',
  async ({ groupName, members, adminId, avatar }: { groupName: string; members: string[]; adminId: string, avatar: string }, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.post(
        `${CHAT_SERVICE_URL}/conversations/group`,
        { groupName, members, adminId, avatar },
        { headers: { Authorization: `${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating group conversation:', error);
      return rejectWithValue('Failed to create group conversation');
    }
  }
);

// 4️⃣ Thêm thành viên vào nhóm
export const addMemberToGroup = createAsyncThunk(
  'chat/addMemberToGroup',
  async ({ conversationId, newMember }: { conversationId: string; newMember: string }, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.post(
        `${CHAT_SERVICE_URL}/conversations/group/addMember`,
        { conversationId, newMember },
        { headers: { Authorization: `${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding member to group:', error);
      return rejectWithValue('Failed to add member to group');
    }
  }
);

// 5️⃣ Xóa thành viên khỏi nhóm
export const removeMemberFromGroup = createAsyncThunk(
  'chat/removeMemberFromGroup',
  async ({ conversationId, memberId }: { conversationId: string; memberId: string }, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.post(
        `${CHAT_SERVICE_URL}/conversations/group/removeMember`,
        { conversationId, memberId },
        { headers: { Authorization: `${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error removing member from group:', error);
      return rejectWithValue('Failed to remove member from group');
    }
  }
);

// 6️⃣ Chuyển trưởng nhóm
export const changeGroupAdmin = createAsyncThunk(
  'chat/changeGroupAdmin',
  async ({ conversationId, newAdminId }: { conversationId: string; newAdminId: string }, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.post(
        `${CHAT_SERVICE_URL}/conversations/group/changeAdmin`,
        { conversationId, newAdminId },
        { headers: { Authorization: `${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error changing group admin:', error);
      return rejectWithValue('Failed to change group admin');
    }
  }
);

// 7️⃣ Lấy danh sách cuộc trò chuyện gần đây
export const getRecentConversations = createAsyncThunk(
  'chat/getRecentConversations',
  async (userId: string, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(
        `${CHAT_SERVICE_URL}/conversations/recent/${userId}`,
        { headers: { Authorization: `${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting recent conversations:', error);
      return rejectWithValue('Failed to get recent conversations');
    }
  }
);

// 8️⃣ Tìm kiếm cuộc trò chuyện theo tên nhóm hoặc tên người còn lại
export const searchConversations = createAsyncThunk(
  'chat/searchConversations',
  async (query: { userId: string; keyword: string }, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(
        `${CHAT_SERVICE_URL}/conversations/search`,
        {
          headers: { Authorization: `${token}` },
          params: query,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error searching conversations:', error);
      return rejectWithValue('Failed to search conversations');
    }
  }
);

// 9️⃣ Gửi tin nhắn
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, senderId, type, content, isDeleted }: { conversationId: string; senderId: string; type: string; content: string, isDeleted: boolean }, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.post(
        `${CHAT_SERVICE_URL}/messages/send`,
        { conversationId, senderId, type, content, isDeleted },
        { headers: { Authorization: `${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      return rejectWithValue('Failed to send message');
    }
  }
);

// 10️⃣ Lấy tin nhắn của cuộc trò chuyện
export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (conversationId: string, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(
        `${CHAT_SERVICE_URL}/messages/${conversationId}`,
        { headers: { Authorization: `${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting messages:', error);
      return rejectWithValue('Failed to get messages');
    }
  }
);

// 11️⃣ Lấy 5 tin nhắn gần nhất là hình ảnh
export const getRecentImages = createAsyncThunk(
  'chat/getRecentImages',
  async (conversationId: string, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(
        `${CHAT_SERVICE_URL}/messages/images/${conversationId}`,
        { headers: { Authorization: `${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting recent images:', error);
      return rejectWithValue('Failed to get recent images');
    }
  }
);

// 12️⃣ Lấy 5 tin nhắn gần nhất là file
export const getRecentFiles = createAsyncThunk(
  'chat/getRecentFiles',
  async (conversationId: string, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(
        `${CHAT_SERVICE_URL}/messages/files/${conversationId}`,
        { headers: { Authorization: `${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting recent files:', error);
      return rejectWithValue('Failed to get recent files');
    }
  }
);

// 13️⃣ Ghim tin nhắn
export const pinMessage = createAsyncThunk(
  'chat/pinMessage',
  async ({ conversationId, messageId }: { conversationId: string; messageId: string }, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.post(
        `${CHAT_SERVICE_URL}/messages/pin`,
        { conversationId, messageId },
        { headers: { Authorization: `${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error pinning message:', error);
      return rejectWithValue('Failed to pin message');
    }
  }
);

// 14️⃣ Lấy tin nhắn đã ghim
export const getPinnedMessages = createAsyncThunk(
  'chat/getPinnedMessages',
  async (conversationId: string, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(
        `${CHAT_SERVICE_URL}/messages/pinned/${conversationId}`,
        { headers: { Authorization: `${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting pinned messages:', error);
      return rejectWithValue('Failed to get pinned messages');
    }
  }
);

// 15️⃣ Thu hồi tin nhắn
export const revokeMessage = createAsyncThunk(
  'chat/revokeMessage',
  async ({ messageId }: { messageId: string }, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.post(
        `${CHAT_SERVICE_URL}/messages/revoke`,
        { messageId },
        { headers: { Authorization: `${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error revoking message:', error);
      return rejectWithValue('Failed to revoke message');
    }
  }
);

// 16️⃣ Bỏ ghim tin nhắn
export const unpinMessage = createAsyncThunk(
  'chat/unpinMessage',
  async ({ conversationId, messageId }: { conversationId: string; messageId: string }, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.post(
        `${CHAT_SERVICE_URL}/messages/unpin`,
        { conversationId, messageId },
        { headers: { Authorization: `${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error unpinning message:', error);
      return rejectWithValue('Failed to unpin message');
    }
  }
);

// 17️⃣ Cập nhật thông tin nhóm
export const updateGroupInfo = createAsyncThunk(
  'chat/updateGroupInfo',
  async (
    { conversationId, groupName, avatar }: { conversationId: string; groupName: string; avatar: string },
    { getState, rejectWithValue }
  ) => {
    const token = (getState() as RootState).auth?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.put(
        `${CHAT_SERVICE_URL}/conversations/group/update/${conversationId}`,
        { groupName, avatar },
        { headers: { Authorization: `${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating group conversation:', error);
      return rejectWithValue('Failed to update group conversation');
    }
  }
);

const getLastMessageContent = (message: Message): string => {
  switch (message.type) {
    case 'image':
      return '[Image]';
    case 'video':
      return '[Video]';
    case 'file':
      return '[File]';
    case 'audio':
      return '[Audio]';
    default:
      return typeof message.content === 'string' ? message.content : '[Message]';
  }
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // addMessageToState: (state, action: PayloadAction<Message>) => {
    //   if (state.selectedConversation) {
    //     const conversation = state.selectedConversation;
    //     // Tìm cuộc trò chuyện và cập nhật tin nhắn
    //     if (conversation._id === action.payload.conversationId) {
    //       if (!conversation.messages) {
    //         conversation.messages = [];  // Khởi tạo mảng messages nếu chưa có
    //       }
    //       conversation.messages.push(action.payload); // Thêm tin nhắn vào state
    //       conversation.lastMessage = action.payload.content; // Cập nhật lastMessage
    //     }
    //   }
    // },
    addMessageToState: (state, action: PayloadAction<{ message: Message; currentUserId: string }>) => {
      const { message: newMessage, currentUserId } = action.payload;
      const conversation = state.selectedConversation;
    
      // Cập nhật tin nhắn vào selectedConversation
      if (conversation && conversation._id === newMessage.conversationId) {
        if (!conversation.messages) {
          conversation.messages = [];
        }
        conversation.messages = [
          ...(conversation.messages || []),
          newMessage,
        ];
      }

      const conv = state.conversations.find(
        (c) => c._id === newMessage.conversationId
      );

      if (conv) {
        conv.lastMessage = getLastMessageContent(newMessage);
        conv.messages = [...(conv.messages || []), newMessage];
        if (conv._id !== state.selectedConversation?._id && newMessage.senderId !== currentUserId) {
          conv.unreadCount = (conv.unreadCount || 0) + 1;
        }
      }
    
      // Cập nhật lastMessage và unreadCount cho tất cả các cuộc trò chuyện
      // state.conversations.forEach((conv) => {
      //   if (conv._id === newMessage.conversationId) {
      //     conv.lastMessage = newMessage.content;
      //     conv.unreadCount = conv.unreadCount ? conv.unreadCount + 1 : 1;
      //   }
      // });
    },
    // Action để cập nhật cuộc trò chuyện đã chọn
    setSelectedConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.selectedConversation = action.payload;
      console.log('Selected conversationwwwwwwwwwwwwww:', action.payload); // Debugging log

      // Kiểm tra nếu payload là null
      if (action.payload) {
        state.messages = action.payload.messages || [];
      } else {
        state.messages = [];  // Đặt mảng messages rỗng nếu không có cuộc trò chuyện nào được chọn
      }
    },

    setUnreadToZero: (state, action: PayloadAction<string>) => {
      const convo = state.conversations.find(c => c._id === action.payload);
      if (convo && convo.unreadCount && convo.unreadCount > 0) {
        convo.unreadCount = 0;
      }
    }
    
  },
  extraReducers: (builder) => {
    // 1️⃣ Kiểm tra trạng thái online của người dùng
    builder
      .addCase(getAllConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllConversations.fulfilled, (state, action: PayloadAction<Conversation[], string, { arg: string }>) => {
        state.loading = false;

        const currentUserId = (action.meta.arg as string); // user._id

        const unreadMap = new Map<string, number>();
        state.conversations.forEach((conv) => {
          if (conv._id && typeof conv.unreadCount === 'number') {
            unreadMap.set(conv._id, conv.unreadCount);
          }
        });

        console.log('Fetched conversations:payloadadadadadad', action.payload); // Debugging log
        console.log('User ID:', currentUserId); // Debugging log
        state.conversations = action.payload.map((conv) => {
          if (!conv.isGroup) {
            const other = conv.members.find((m) => m.userId !== currentUserId);
            conv.groupName = other?.name || 'Unknown';
            conv.avatar = other?.avatar || '';
          }
      
          // ⚠️ Gán lại unreadCount nếu có
          conv.unreadCount = unreadMap.get(conv._id) || 0;
      
          return conv;
        });


      })
      .addCase(getAllConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;  // Lưu lỗi nếu có
      })
      .addCase(checkUserOnline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserOnline.fulfilled, (state, action: PayloadAction<{ userId: string; online: boolean }>) => {
        state.loading = false;
        state.onlineUsers = state.onlineUsers.filter(user => user !== action.payload.userId);
        if (action.payload.online) {
          state.onlineUsers.push(action.payload.userId);
        }
      })
      .addCase(checkUserOnline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 2️⃣ Tạo hoặc lấy cuộc trò chuyện riêng tư
    builder
      .addCase(createOrGetPrivateConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrGetPrivateConversation.fulfilled, (state, action: PayloadAction<Conversation>) => {
        state.loading = false;
        state.conversations = state.conversations ? [action.payload, ...state.conversations] : [action.payload];
      })
      .addCase(createOrGetPrivateConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 3️⃣ Tạo nhóm chat
    builder
      .addCase(createGroupConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroupConversation.fulfilled, (state, action: PayloadAction<Conversation>) => {
        state.loading = false;
        state.conversations = state.conversations ? [action.payload, ...state.conversations] : [action.payload];
      })
      .addCase(createGroupConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 4️⃣ Thêm thành viên vào nhóm
    builder
      .addCase(addMemberToGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMemberToGroup.fulfilled, (state, action: PayloadAction<Conversation>) => {
        state.loading = false;
        const index = state.conversations?.findIndex(conv => conv._id === action.payload._id);
        if (index !== undefined && index !== -1 && state.conversations) {
          state.conversations[index] = action.payload;
        }
      })
      .addCase(addMemberToGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 5️⃣ Xóa thành viên khỏi nhóm
    builder
      .addCase(removeMemberFromGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMemberFromGroup.fulfilled, (state, action: PayloadAction<Conversation>) => {
        state.loading = false;
        const index = state.conversations?.findIndex(conv => conv._id === action.payload._id);
        if (index !== undefined && index !== -1 && state.conversations) {
          state.conversations[index] = action.payload;
        }
      })
      .addCase(removeMemberFromGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 6️⃣ Chuyển trưởng nhóm
    builder
      .addCase(changeGroupAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeGroupAdmin.fulfilled, (state, action: PayloadAction<Conversation>) => {
        state.loading = false;
        const index = state.conversations?.findIndex(conv => conv._id === action.payload._id);
        if (index !== undefined && index !== -1 && state.conversations) {
          state.conversations[index] = action.payload;
        }
      })
      .addCase(changeGroupAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 7️⃣ Lấy danh sách cuộc trò chuyện gần đây
    builder
      .addCase(getRecentConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentConversations.fulfilled, (state, action: PayloadAction<Conversation[]>) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(getRecentConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 8️⃣ Tìm kiếm cuộc trò chuyện
    builder
      .addCase(searchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchConversations.fulfilled, (state, action: PayloadAction<Conversation[]>) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(searchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 9️⃣ Gửi tin nhắn
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.loading = false;
        if (state.messages) {
          state.messages.push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🔟 Lấy tin nhắn
    builder
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 1️⃣1️⃣ Lấy 5 tin nhắn gần nhất là hình ảnh
    builder
      .addCase(getRecentImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentImages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getRecentImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 1️⃣2️⃣ Lấy 5 tin nhắn gần nhất là file
    builder
      .addCase(getRecentFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentFiles.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getRecentFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 1️⃣3️⃣ Ghim tối đa 2 tin nhắn
    builder
      .addCase(pinMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pinMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.loading = false;
        if (state.messages) {
          state.messages.push(action.payload);
        }
      })
      .addCase(pinMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 1️⃣4️⃣ Lấy tin nhắn đã ghim
    builder
      .addCase(getPinnedMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPinnedMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getPinnedMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 1️⃣5️⃣ Thu hồi tin nhắn
    builder
      .addCase(revokeMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(revokeMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.loading = false;
        if (state.messages) {
          const message = state.messages.find(msg => msg._id === action.payload._id);
          if (message) {
            message.isDeleted = true;
            message.content = "Message revoked";
          }
        }
      })
      .addCase(revokeMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 1️⃣6️⃣ Bỏ ghim tin nhắn
    builder
      .addCase(unpinMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unpinMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.loading = false;
        if (state.messages) {
          state.messages = state.messages.filter((msg) => msg._id !== action.payload._id);
        }
      })
      .addCase(unpinMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    // 17️⃣ Cập nhật thông tin nhóm
    builder
      .addCase(updateGroupInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroupInfo.fulfilled, (state, action: PayloadAction<Conversation>) => {
        state.loading = false;
        // Cập nhật thông tin nhóm trong state
        const updatedConversation = action.payload;
        const index = state.conversations.findIndex(conv => conv._id === updatedConversation._id);
        if (index !== -1) {
          state.conversations[index] = updatedConversation; // Cập nhật thông tin nhóm trong danh sách cuộc trò chuyện
        }
        if (state.selectedConversation?._id === updatedConversation._id) {
          state.selectedConversation = updatedConversation; // Cập nhật cuộc trò chuyện đã chọn
        }
      })
      .addCase(updateGroupInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addMessageToState, setSelectedConversation, setUnreadToZero } = chatSlice.actions;
export default chatSlice.reducer;
