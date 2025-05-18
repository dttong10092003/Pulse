// src/redux/slices/postProfileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const URI_API = import.meta.env.VITE_API_URL + '/posts';
// const URI_API = "http://localhost:3000/posts";

interface Post {
  _id: string;
  content: string;
  media?: string[];
  tags?: string[];
  userId: string;
  createdAt: string;
  username: string;
  avatar: string;
  sharedPost?: {
    _id: string;
    content: string;
    media?: string[];
    username: string;
    avatar: string;
  };   
}
export interface PostStatistics {
  totalPosts: number;
  todayPosts: number;
  reportedPosts: number;
  hiddenPosts: number;
  postTrend: { date: string; count: number }[];
  recentPosts: {
    _id: string;
    content: string;
    createdAt: string;
    username: string;
    status: "active" | "reported" | "hidden";
  }[];
}
interface TopPost {
  _id: string;
  user: string;
  content: string;
  likes?: number;
  comments?: number;
  shares?: number;
}
interface PostState {
  posts: Post[];
  count: number;
  loading: boolean;
  error: string | null;
  statistics: PostStatistics | null;
  loadingStatistics: boolean;
  loadingTopStats: boolean;
  topStats: {
    topLikedPosts: TopPost[];
    topCommentedPosts: TopPost[];
    topSharedPosts: TopPost[];
  } | null;
}


const initialState: PostState = {
  posts: [],
  count: 0,
  loading: false,
  error: null,
  statistics: null,
  loadingStatistics: false,
  loadingTopStats: false,
  topStats: null,
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

export const createPost = createAsyncThunk(
  "postProfile/createPost",
  async (
    data: { content: string; media?: string[]; tags?: string[]; sharedPostId?: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      const res = await axios.post(
        `${URI_API}`,
        data,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const deletePost = createAsyncThunk(
  "postProfile/deletePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${URI_API}/${postId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return { postId };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAllPosts = createAsyncThunk(
  "postProfile/fetchAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${URI_API}`); // GET /posts
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const editPost = createAsyncThunk(
  "postProfile/editPost",
  async (
    data: {
      postId: string;
      content?: string;
      media?: string[];
      tags?: string[]; // ✅ thêm dòng này
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      const { postId, ...updateData } = data;

      const res = await axios.put(
        `${URI_API}/${postId}`,
        updateData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.data.post;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchPostStatistics = createAsyncThunk(
  "postProfile/fetchPostStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${URI_API}/admin/statistics`);
      return res.data as PostStatistics;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const fetchTopStats = createAsyncThunk(
  "postProfile/fetchTopStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${URI_API}/admin/top-stats`);
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
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.posts.unshift(action.payload);
        state.count += 1;
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<{ postId: string }>) => {
        state.posts = state.posts.filter(post => post._id !== action.payload.postId);
        state.count = state.posts.length;
      })
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.posts = action.payload;
        state.count = action.payload.length;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editPost.fulfilled, (state, action: PayloadAction<Post>) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload; // Cập nhật lại bài post đã chỉnh sửa
        }
      })
      .addCase(fetchPostStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostStatistics.fulfilled, (state, action: PayloadAction<PostStatistics>) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchPostStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTopStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopStats.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.topStats = action.payload;
      })
      .addCase(fetchTopStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })      
;      
  },
});

export default postProfileSlice.reducer;
