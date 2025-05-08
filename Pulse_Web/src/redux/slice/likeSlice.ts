import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../services/api';

const LIKE_API = import.meta.env.VITE_API_URL + '/likes';
export const fetchUserLikedPosts = createAsyncThunk(
  'likes/fetchUserLikedPosts',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${LIKE_API}/user-liked-posts`, {
        headers: { Authorization: `${token}` },
      });
      return res.data.likedPostIds;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchLikeCounts = createAsyncThunk(
  'likes/fetchLikeCounts',
  async (postIds: string[], { rejectWithValue }) => {
    try {
      const res = await axios.post(`${LIKE_API}/count-by-posts`, { postIds });
      return res.data; // { [postId]: likeCount }
    } catch (err: any) {
      console.error("❌ Failed to fetch like counts:", err.response?.data || err.message);
      return rejectWithValue('Failed to fetch like counts');
    }
  }
);


export const likePost = createAsyncThunk('likes/likePost', async (postId: string) => {
  const token = localStorage.getItem('token');
  await axios.post(`${LIKE_API}/${postId}`, {}, {
    headers: { Authorization: `${token}` }
  });
  return postId;
});

export const unlikePost = createAsyncThunk('likes/unlikePost', async (postId: string) => {
  const token = localStorage.getItem('token');
  await axios.delete(`${LIKE_API}/${postId}`, {
    headers: { Authorization: `${token}` }
  });
  return postId;
});

export const fetchLikesByPost = createAsyncThunk(
  'likes/fetchLikesByPost',
  async (postId: string) => {
    const response = await api.get(`/likes/${postId}`);
    return response.data; // dạng [{ userId, timestamp }]
  }
);

interface LikeState {
  usersByPost: any;
  likedPostIds: string[];
  likeCounts: Record<string, number>;
}

const initialState: LikeState = {
  likedPostIds: [],
  likeCounts: {},
  usersByPost: undefined
};

const likeSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLikedPosts.fulfilled, (state, action) => {
        state.likedPostIds = action.payload;
      })
      .addCase(fetchLikeCounts.fulfilled, (state, action) => {
        state.likeCounts = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const postId = action.payload;
        if (!state.likedPostIds.includes(postId)) {
          state.likedPostIds.push(postId);
        }
        state.likeCounts[postId] = (state.likeCounts[postId] || 0) + 1;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const postId = action.payload;
        state.likedPostIds = state.likedPostIds.filter((id) => id !== postId);
        state.likeCounts[postId] = Math.max(0, (state.likeCounts[postId] || 1) - 1);
      });
  }
});

export default likeSlice.reducer;
