// redux/slice/notificationSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from '../store';

const API_BASE_URL = "http://localhost:3000/noti"; // Qua API Gateway


export interface Notification {
  _id: string;
  type: "message" | "like" | "comment";
  receiverId: string;
  senderId: string;
  messageContent?: string;
  chatId?: string;
  postId?: string;
  commentContent?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

// ✅ Lấy danh sách thông báo gần nhất
export const fetchRecentNotifications = createAsyncThunk(
  "notification/fetchRecentNotifications",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const userId = state.auth.user?._id;

      if (!userId) {
        throw new Error("Missing userId from Redux");
      }

      const linkapi = `http://localhost:3000/noti/all?userId=${userId}`;
      const response = await axios.get(linkapi);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch notifications"
      );
    }
  }
);

// ✅ Đánh dấu 1 thông báo là đã đọc
export const markNotificationAsRead = createAsyncThunk(
  "notification/markAsRead",
  async ({ id, userId }: { id: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/markOne/${id}`, { userId });
      return response.data.notification;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// ✅ Đánh dấu nhiều thông báo là đã đọc
export const markMultipleNotificationsAsRead = createAsyncThunk(
  "notification/markManyAsRead",
  async ({ ids, userId }: { ids: string[]; userId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/markMany`, { ids, userId });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);



const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotifications(state) {
      state.notifications = [];
    },
    markOneAsRead(state, action) {
      const id = action.payload;
      const target = state.notifications.find(n => n._id === id);
      if (target) target.isRead = true;
    },
    markManyAsRead(state, action) {
      const ids: string[] = action.payload;
      state.notifications = state.notifications.map(n =>
        ids.includes(n._id) ? { ...n, isRead: true } : n
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentNotifications.fulfilled, (state, action) => {
        console.log("📥 Danh sách thông báo đã fetch thành công:", action.payload);
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchRecentNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const updated = action.payload;
        const target = state.notifications.find(n => n._id === updated._id);
        if (target) target.isRead = true;
      })
      .addCase(markMultipleNotificationsAsRead.fulfilled, (state, action) => {
        const { ids } = action.meta.arg;
        state.notifications.forEach(n => {
          if (ids.includes(n._id)) {
            n.isRead = true;
          }
        });
      });
      
  },
});

export const {
  clearNotifications,
  markOneAsRead,
  markManyAsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;
