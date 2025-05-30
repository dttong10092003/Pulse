import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

const COMMENT_SERVICE_URL = import.meta.env.VITE_API_URL + '/comments';
interface Reply {
    _id?: string;
    userId: string;
    text: string;
    timestamp: string;
    user: {
        firstname: string;
        lastname: string;
        avatar: string;
    };
}

export interface CommentType {
    _id: string;
    postId: string;
    userId: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    replies: Reply[];
    user?: {
        username: string;
        avatar: string;
        firstname: string;
        lastname: string;
    };
}

export interface UserInfo {
    firstname: string;
    lastname: string;
    avatar: string;
    username: string;
  }  

interface CommentState {
    comments: CommentType[];
    loading: boolean;
    error: string | null;
    commentCounts: Record<string, number>;
}

const initialState: CommentState = {
    comments: [],
    loading: false,
    error: null,
    commentCounts: {} as Record<string, number>,
};

// 1️⃣ Lấy comment theo postId
export const getCommentsByPost = createAsyncThunk<CommentType[], string>(
    'comments/getByPost',
    async (postId, { getState, rejectWithValue }) => {
        const token = (getState() as RootState).auth.token;

        try {
            const res = await axios.get(`${COMMENT_SERVICE_URL}/${postId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });
            return res.data as CommentType[];
        } catch (error) {
            console.error("❌ Failed to get comments:", error);
            return rejectWithValue('Failed to fetch comments');
        }
    }
);

export const createComment = createAsyncThunk<CommentType, { postId: string; text: string }, { state: RootState }>(
    'comments/create',
    async ({ postId, text }, { getState, rejectWithValue }) => {
      const token = getState().auth.token;
      if (!token) return rejectWithValue('No token found');
  
      try {
        const res = await axios.post(
          COMMENT_SERVICE_URL,
          { postId, text },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data.comment; // ✅ đã có user trong response
      } catch (error: any) {
        return rejectWithValue('Failed to create comment');
      }
    }
  );


// 3️⃣ Thêm phản hồi vào comment
export const addReply = createAsyncThunk(
    'comments/addReply',
    async ({ commentId, text }: { commentId: string; text: string }, { getState, rejectWithValue }) => {
        const token = (getState() as RootState).auth.token;
        if (!token) return rejectWithValue('No token found');

        try {
            const res = await axios.post(
                `${COMMENT_SERVICE_URL}/reply/${commentId}`,
                { text },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return { commentId, reply: res.data.reply }; // ✅ sửa tại đây
        } catch (error) {
            return rejectWithValue('Failed to reply to comment');
        }
    }
);

// 🆕 Lấy số lượng comment theo từng postId
export const getCommentCountsByPosts = createAsyncThunk(
    'comments/getCommentCountsByPosts',
    async (postIds: string[], { rejectWithValue }) => {
        try {
            const res = await axios.post(`${COMMENT_SERVICE_URL}/count-by-posts`, { postIds });
            return res.data; // { [postId]: count }
        } catch (error: any) {
            console.error("❌ Failed to get comment counts:", error.response?.data || error.message);
            return rejectWithValue('Failed to get comment counts');
        }
    }
);


const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        resetComments: (state) => {
            state.comments = [];
            state.error = null;
            state.loading = false;
        },
        appendReplyToComment: (state, action: PayloadAction<{ commentId: string; reply: Reply }>) => {
            const { commentId, reply } = action.payload;
            const comment = state.comments.find((c) => c._id === commentId);
            if (comment) {
                comment.replies.push(reply);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCommentsByPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCommentsByPost.fulfilled, (state, action: PayloadAction<CommentType[]>) => {
                state.loading = false;
                state.comments = action.payload;
            })
            .addCase(getCommentsByPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(createComment.fulfilled, (state, action: PayloadAction<CommentType>) => {
                const comment = action.payload;
                state.comments.unshift(comment);
            })
            .addCase(addReply.fulfilled, (state, action: PayloadAction<{ commentId: string; reply: Reply }>) => {
                const { commentId, reply } = action.payload;
                const comment = state.comments.find((c) => c._id === commentId);
                if (comment) {
                    comment.replies.push(reply);
                }
            })

            .addCase(getCommentCountsByPosts.fulfilled, (state, action: PayloadAction<Record<string, number>>) => {
                state.commentCounts = action.payload;
            });
    },
});
export const { resetComments } = commentSlice.actions;
export default commentSlice.reducer;
