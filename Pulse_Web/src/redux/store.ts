import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import userReducer from './slice/userSlice'; 
import chatReducer from './slice/chatSlice';
import postProfileReducer from './slice/postProfileSlice';
import followReducer from './slice/followSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer, 
    user: userReducer,
    chat: chatReducer,
    postProfile: postProfileReducer,
    follow: followReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;