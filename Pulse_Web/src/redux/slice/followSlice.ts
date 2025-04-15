// redux/slice/followSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const FOLLOW_API = 'http://localhost:3000/follow';

interface FollowItem {
  _id: string;
  followerId: string;
  followingId: string;
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

export const followUser = createAsyncThunk(
  'follow/followUser',
  async ({ followingId, token }: FollowPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${FOLLOW_API}`,
        { followingId },
        {
          headers: { 'x-user-id': token }
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

export const unfollowUser = createAsyncThunk(
  'follow/unfollowUser',
  async ({ followingId, token }: FollowPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${FOLLOW_API}/unfollow`,
        { followingId },
        {
          headers: { 'x-user-id': token }
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

export const getFollowers = createAsyncThunk(
  'follow/getFollowers',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${FOLLOW_API}/followers/${userId}`);
      return response.data.data as FollowItem[];
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue('Failed to fetch followers');
      }      
  }
);

export const getFollowings = createAsyncThunk(
  'follow/getFollowings',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${FOLLOW_API}/followings/${userId}`);
      return response.data.data as FollowItem[];
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          return rejectWithValue(error.response.data.message);
        }
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
    }
  },
  extraReducers: (builder) => {
    builder
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
