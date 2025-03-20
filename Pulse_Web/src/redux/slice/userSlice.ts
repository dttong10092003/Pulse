// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";

// // API Gateway Endpoint
// const API_GATEWAY_URL = "http://localhost:3000/users";

// // Định nghĩa kiểu dữ liệu User
// interface UserProfile {
//   userId: string;
//   firstname: string;
//   lastname: string;
//   DOB: string;
//   gender: string;
//   phoneNumber?: string;
//   email?: string;
//   address?: string;
//   bio?: string;
//   avatar?: string;
//   backgroundAvatar?: string;
// }

// // Trạng thái Redux cho user
// interface UserState {
//   user: UserProfile | null;
//   loading: boolean;
//   error: string | null;
// }

// // Trạng thái ban đầu của Redux store
// const initialState: UserState = {
//   user: null,
//   loading: false,
//   error: null,
// };

// // 🌟 **1. Lấy thông tin người dùng theo ID**
// export const fetchUserProfile = createAsyncThunk(
//   "user/fetchUserProfile",
//   async (userId: string, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Unauthorized: No token provided");

//       const response = await axios.get(`${API_GATEWAY_URL}/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       return response.data; // Trả về dữ liệu user từ API
//     } catch (error) {
//       if (axios.isAxiosError(error) && error.response) {
//         return rejectWithValue(error.response.data?.message || "Failed to fetch user data");
//       }
//       return rejectWithValue("Failed to fetch user data");
//     }
//   }
// );

// // 🌟 **2. Cập nhật thông tin người dùng**
// export const updateUserProfile = createAsyncThunk(
//   "user/updateUserProfile",
//   async (userData: UserProfile, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Unauthorized: No token provided");

//       const response = await axios.put(`${API_GATEWAY_URL}/${userData.userId}`, userData, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       });

//       return response.data.user; // Trả về dữ liệu user đã cập nhật
//     } catch (error) {
//       if (axios.isAxiosError(error) && error.response) {
//         return rejectWithValue(error.response.data?.message || "Failed to update user data");
//       }
//       return rejectWithValue("Failed to update user data");
//     }
//   }
// );

// // 🌟 **Tạo Redux Slice**
// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     setUserProfile: (state, action: PayloadAction<UserProfile>) => {
//       state.user = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(fetchUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(updateUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(updateUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// // 🌟 Export actions và reducer
// export const { setUserProfile } = userSlice.actions;
// export default userSlice.reducer;
