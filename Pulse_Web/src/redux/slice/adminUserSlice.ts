import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;
export interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
  dob: string;
  gender: "male" | "female";
  username: string;
  isActive: boolean;
  isAdmin: boolean;
  isCountReport: number;
  createdAt: string;
  phone: string;
}

interface AdminUserState {
  users: User[];
  maleCount: number;
  femaleCount: number;
  bannedCount: number;
  totalCount: number;
  newUsersThisMonth: number;
  bannedUsers: User[];
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
}

const initialState: AdminUserState = {
  users: [],
  maleCount: 0,
  femaleCount: 0,
  bannedCount: 0,
  totalCount: 0,
  newUsersThisMonth: 0,
  bannedUsers: [],
  loading: false,
  error: null,
  selectedUser: null,
};

export const fetchAllUsers = createAsyncThunk("adminUsers/fetchAll", async () => {
  const response = await axios.get<User[]>(`${BASE_URL}/users/all`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch users");
  }
  else if (response.data.length === 0) {
    throw new Error("No users found");
  }
  console.log(" lấy danh sách user thành công :----:", response.data.length);
  return response.data;
});

const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
         const users = action.payload.filter((u) => !u.isAdmin);
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
      
        state.users = users;
        state.totalCount = users.length;
        state.maleCount = users.filter((u) => u.gender === "male").length;
        state.femaleCount = users.filter((u) => u.gender === "female").length;
        state.bannedUsers = users.filter((u) => u.isActive === false);
        state.bannedCount = state.bannedUsers.length;

        state.newUsersThisMonth = users.filter((u) => {
          const created = new Date(u.createdAt);
          return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
        }).length;

        state.loading = false;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi khi tải danh sách user";
      });
  },
});

export const { setSelectedUser } = adminUserSlice.actions;
export default adminUserSlice.reducer;
