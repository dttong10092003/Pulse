import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const CHAT_SERVICE_URL = 'http://localhost:3000/chat';

interface Conversation {
  _id: string;
  members: string[];
  isGroup: boolean;
  groupName: string;
  adminId: string | null;
  updatedAt: string;
  createdAt: string;
}

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  type: 'text' | 'emoji' | 'image' | 'file';
  content: string;
  isDeleted: boolean;
  timestamp: string;
}

// Define the state for Chat
interface ChatState {
  conversations: Conversation[] | null;
  messages: Message[] | null;
  onlineUsers: string[]; // List of online users
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: null,
  messages: null,
  onlineUsers: [],
  loading: false,
  error: null,
};

// 1️⃣ Kiểm tra trạng thái online của người dùng
export const checkUserOnline = createAsyncThunk(
  'chat/checkUserOnline',
  async (userId: string, { getState, rejectWithValue }) => {
    const token = (getState() as any).auth.user?.token; // Lấy token từ Redux store
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
  async ({ user1, user2, user2Name }: { user1: string; user2: string; user2Name: string }, { getState, rejectWithValue }) => {
    const token = (getState() as any).auth.user?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.post(
        `${CHAT_SERVICE_URL}/conversations/private`,
        { user1, user2, user2Name },
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
  async ({ groupName, members, adminId }: { groupName: string; members: string[]; adminId: string }, { getState, rejectWithValue }) => {
    const token = (getState() as any).auth.user?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.post(
        `${CHAT_SERVICE_URL}/conversations/group`,
        { groupName, members, adminId },
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
    const token = (getState() as any).auth.user?.token;
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
    const token = (getState() as any).auth.user?.token;
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
    const token = (getState() as any).auth.user?.token;
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
    const token = (getState() as any).auth.user?.token;
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
    const token = (getState() as any).auth.user?.token;
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
  async ({ conversationId, senderId, type, content }: { conversationId: string; senderId: string; type: string; content: string }, { getState, rejectWithValue }) => {
    const token = (getState() as any).auth.user?.token;
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.post(
        `${CHAT_SERVICE_URL}/messages/send`,
        { conversationId, senderId, type, content },
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
    const token = (getState() as any).auth.user?.token;
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
    const token = (getState() as any).auth.user?.token;
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
    const token = (getState() as any).auth.user?.token;
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
    const token = (getState() as any).auth.user?.token;
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
    const token = (getState() as any).auth.user?.token;
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
    const token = (getState() as any).auth.user?.token;
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
    const token = (getState() as any).auth.user?.token;
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
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 1️⃣ Kiểm tra trạng thái online của người dùng
    builder
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
      });
  },
});

export default chatSlice.reducer;
