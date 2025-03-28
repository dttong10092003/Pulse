// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const URI_API = 'http://localhost:3000/auth';

// Define the type for the auth state
interface AuthState {
  user: { username: string; token: string } | null;
  loading: boolean;
  error: string | null;
  checkStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  checkMessage: string | null;
}

// Define the initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  checkStatus: 'idle',
  checkMessage: null,
};

// Define the type for user login data
interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  phoneNumber: string;
  username: string;
  password: string;
}

interface CheckUserExistsData {
  phoneNumber?: string;
  username?: string;
}

// Tạo thunk cho đăng nhập
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData: LoginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${URI_API}/login`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;  // Giả sử API trả về { user, token }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong');
    }
  }
);

export const registerUserWithPhone = createAsyncThunk(
  'auth/registerUserWithPhone',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${URI_API}/register/phone`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data; // Assuming the response contains { token, user }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
    }
  }
);

// export const loginWithGoogle = createAsyncThunk(
//   'auth/loginWithGoogle',
//   async (googleUserInfo: { email: string, googleId: string }, { rejectWithValue }) => {
//     try {
//       console.log('Google User Info:', googleUserInfo);
//       console.log(`${URI_API}/login/google`);
//       const response = await axios.post(`${URI_API}/login/google`, {
//         email: googleUserInfo.email,
//         googleId: googleUserInfo.googleId
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       return response.data; // Response chứa token và user (hoặc thông tin cần thiết)
//     } catch (error) {
//       return rejectWithValue(error instanceof Error ? error.message : 'Google login failed');
//     }
//   }
// );
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (googleUserInfo: { email: string, googleId: string }, { rejectWithValue }) => {
    try {
      console.log('Google User Info:', googleUserInfo);
      const response = await axios.post(`${URI_API}/login/google`, {
        email: googleUserInfo.email,
        googleId: googleUserInfo.googleId
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data; // Response chứa token và user, isVerified
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Google login failed');
    }
  }
);

export const checkUserExists = createAsyncThunk(
  'auth/checkUserExists',
  async (data: CheckUserExistsData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${URI_API}/check-user`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data; // Trả về message
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Phone number or Username already in use');
    }
  }
);

// Tạo slice cho auth
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ username: string; token: string }>) => {
        state.loading = false;
        state.user = action.payload;  // Save user and token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUserWithPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserWithPhone.fulfilled, (state, action: PayloadAction<{ username: string; token: string }>) => {
        state.loading = false;
        state.user = action.payload;  // Save user and token
        console.log("Token đăng ký thành công: ", action.payload.token);
      })
      .addCase(registerUserWithPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action: PayloadAction<{ username: string; token: string }>) => {
        state.loading = false;
        state.user = action.payload;  // Save user and token
        console.log("Token đăng ký bằng Google: ", action.payload.token);
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkUserExists.pending, (state) => {
        state.checkStatus = 'loading';
        state.checkMessage = null;
      })
      .addCase(checkUserExists.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.checkStatus = 'succeeded';
        state.checkMessage = action.payload.message;
      })
      .addCase(checkUserExists.rejected, (state, action) => {
        state.checkStatus = 'failed';
        state.checkMessage = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;