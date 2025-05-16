import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  _id: string;
  type: string;
  senderId: string;
  receiverId: string;
  messageContent?: string;
  postId?: string;
  commentContent?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // Gán danh sách toàn bộ noti + tính số chưa đọc
    setAllNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    },

    // Thêm một noti mới vào đầu danh sách
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },

    // Đánh dấu tất cả là đã đọc
    markAllAsReadRedux(state) {
      state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
      state.unreadCount = 0;
    },

    // Đánh dấu 1 thông báo là đã đọc (trừ nếu đang là chưa đọc)
    markOneAsReadRedux(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.map(n => {
        if (n._id === action.payload && !n.isRead) {
          state.unreadCount -= 1;
          return { ...n, isRead: true };
        }
        return n;
      });
    },
    removeNotificationByPostId(state, action: PayloadAction<{ postId: string, type: string }>) {
      state.notifications = state.notifications.filter(
        (n) => !(n.postId === action.payload.postId && n.type === action.payload.type)
      );
      // Cập nhật lại unreadCount
      state.unreadCount = state.notifications.filter(n => !n.isRead).length;
    }
  },
});

export const {
  setAllNotifications,
  addNotification,
  markAllAsReadRedux,
  markOneAsReadRedux,
  removeNotificationByPostId,
} = notificationSlice.actions;

export default notificationSlice.reducer;
