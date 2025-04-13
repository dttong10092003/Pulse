import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

const USER_SERVICE_URL = 'http://localhost:3000/users'; // Cập nhật URL nếu cần

interface User {
  _id: string;
  name: string;
  username: string;
  avatar: string;
}

// Define the type for the user state
interface UserState {
  userDetails: any | null; // Thông tin chi tiết người dùng
  top10Users: User[];
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: UserState = {
  userDetails: null,
  top10Users: [],
  loading: false,
  error: null,
};

// Thunk to get user details from the API
export const getUserDetails = createAsyncThunk(
  'user/getUserDetails',
  async (userId: string, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token; // Lấy token từ Redux store
    try {
      const response = await axios.get(`${USER_SERVICE_URL}/${userId}`, {
        headers: { Authorization: `${token}` },
      });
      return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Thunk to create a new user detail
export const createUserDetail = createAsyncThunk(
  'user/createUserDetail',
  async (userData: any, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token; // Lấy token từ Redux store
    try {
      console.log("Data sent to API:", userData); // Debug: Kiểm tra dữ liệu gửi đi
      const response = await axios.post(`${USER_SERVICE_URL}`, userData, {
        headers: { Authorization: `${token}` },
      });
      return response.data; // Trả về dữ liệu người dùng mới
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);
// Thunk to update user details
export const updateUserDetail = createAsyncThunk(
  'user/updateUserDetail',
  async (userData: any, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token; // Lấy token từ Redux store
    try {
      console.log("Data sent to API:", userData); // Debug: Kiểm tra dữ liệu gửi đi
      const response = await axios.put(`${USER_SERVICE_URL}/${userData.id}`, userData, {
        headers: { Authorization: `${token}` },
      });
      return response.data; // Trả về dữ liệu người dùng đã cập nhật
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const getUserDetailsByIds = createAsyncThunk(
  'user/getUserDetailsByIds',
  async (userIds: string[], { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth?.token; // Lấy token từ Redux store
    try {
      // Gửi yêu cầu POST đến API Gateway với mảng userIds
      const response = await axios.post(`${USER_SERVICE_URL}/user-details-by-ids`, { userIds }, {
        headers: { Authorization: `${token}` },
      });
      return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Thunk to get top 10 users from the API
// export const getTop10Users = createAsyncThunk(
//   "user/getTop10Users",
//   async (excludeUserId: string, { rejectWithValue }) => {
//     try {
//       console.log("📤 axios gửi với excludeUserId:", excludeUserId);
//       const response = await axios.get(`${USER_SERVICE_URL}/top10-users`, {
//         params: { excludeUserId },
//       });

//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.message || error.message);
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

export const getTop10Users = createAsyncThunk(
  "user/getTop10Users",
  async (excludeUserId: string, { rejectWithValue }) => {
    try {
      const url = `${USER_SERVICE_URL}/top10-users?excludeUserId=${excludeUserId}`;
      console.log("🚀 Final URL:", url); // 🧩 In ra URL đầy đủ để debug

      const response = await fetch(url);
      const data = await response.json();

      console.log("✅ fetch result:", data); // 🧩 In ra kết quả
      return data;
    } catch (error) {
      console.error("❌ fetch failed:", error);
      return rejectWithValue("Fetch failed");
    }
  }
);


// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.userDetails = action.payload; // Lưu thông tin người dùng vào state
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUserDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserDetail.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.userDetails = action.payload; // Lưu thông tin người dùng mới vào state
      })
      .addCase(createUserDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDetail.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.userDetails = action.payload; // Lưu thông tin người dùng đã cập nhật vào state
      })
      .addCase(updateUserDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserDetailsByIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetailsByIds.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.userDetails = action.payload; // Lưu danh sách userDetails vào state
      })
      .addCase(getUserDetailsByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getTop10Users.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTop10Users.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.top10Users = action.payload; // Lưu danh sách top 10 người dùng vào state
      })
      .addCase(getTop10Users.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
