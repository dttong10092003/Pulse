// src/redux/slices/postProfileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
const URI_API = 'http://localhost:3000/posts';

interface Post {
  _id: string;
  content: string;
  media?: string;
  tags?: string[];
  userId: string;
  createdAt: string;
}

interface PostState {
  posts: Post[];
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  count: 0,
  loading: false,
  error: null,
};

export const fetchUserPosts = createAsyncThunk(
  "postProfile/fetchUserPosts",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${URI_API}/user/posts?userId=${userId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const postProfileSlice = createSlice({
  name: "postProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.posts = action.payload;
        state.count = action.payload.length;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default postProfileSlice.reducer;
