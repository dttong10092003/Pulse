// redux/slice/followSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const FOLLOW_API = 'http://localhost:3000/follow';

interface UserBasicInfo {
  _id: string;
  firstname:string;
  lastname:string;
  avatar?: string;
}

interface FollowItem {
  _id: string;
  user: UserBasicInfo; // ← Thay vì followerId / followingId
  createdAt?: string;
  updatedAt?: string;
}

interface FollowState {
  followers: FollowItem[];
  followings: FollowItem[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

interface FollowPayload {
  followingId: string;
  token: string;
}

const initialState: FollowState = {
  followers: [],
  followings: [],
  loading: false,
  error: null,
  successMessage: null,
};

// Follow user
// followUser
export const followUser = createAsyncThunk(
  'follow/followUser',
  async ({ followingId, token }: FollowPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${FOLLOW_API}`,
        { followingId },
        {
          headers: { 'x-user-id': token },
        }
      );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Follow failed'
      );
    }
  }
);

// unfollowUser
export const unfollowUser = createAsyncThunk(
  'follow/unfollowUser',
  async ({ followingId, token }: FollowPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${FOLLOW_API}/unfollow`,
        { followingId },
        {
          headers: { 'x-user-id': token },
        }
      );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Unfollow failed'
      );
    }
  }
);

// Get followers
export const getFollowers = createAsyncThunk(
  'follow/getFollowers',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${FOLLOW_API}/followers/${userId}`);
      
      // Kiểm tra dữ liệu trả về
      if (!response.data.data || response.data.data.length === 0) {
        return [];
      }
      
      // Trả về dữ liệu theo đúng định dạng
      return response.data.data;
    } catch {
      return rejectWithValue('Failed to fetch followers');
    }
  }
);

// Redux slice - Thêm logic vào để gọi API lấy followings
export const getFollowings = createAsyncThunk(
  'follow/getFollowings',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${FOLLOW_API}/followings/${userId}`);
      
      if (!response.data.data || response.data.data.length === 0) {
        return [];
      }
      
      return response.data.data;
    } catch {
      return rejectWithValue('Failed to fetch followings');
    }
  }
);

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    resetFollowState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Follow user
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Unfollow user
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get followers
      .addCase(getFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowers.fulfilled, (state, action: PayloadAction<FollowItem[]>) => {
        state.loading = false;
        state.followers = action.payload;
      })
      .addCase(getFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get followings
      .addCase(getFollowings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowings.fulfilled, (state, action: PayloadAction<FollowItem[]>) => {
        state.loading = false;
        state.followings = action.payload;
      })
      .addCase(getFollowings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetFollowState } = followSlice.actions;

export default followSlice.reducer;
