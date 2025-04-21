// redux/slice/callSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CallState {
  isVisible: boolean;
  isCalling: boolean;
  isVideo: boolean;
  calleeName: string;
  calleeAvatar: string;

}

const initialState: CallState = {
  isVisible: false,
  isCalling: false,
  isVideo: false,
  calleeName: '',
  calleeAvatar: '',
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    startCall: (
      state,
      action: PayloadAction<{ isVideo: boolean; calleeName: string, calleeAvatar?: string }>
    ) => {
      state.isVisible = true;
      state.isCalling = true;
      state.isVideo = action.payload.isVideo;
      state.calleeName = action.payload.calleeName;
      state.calleeAvatar = action.payload.calleeAvatar ?? ''; // Default avatar
    },
    endCall: (state) => {
      state.isCalling = false;
    },
    closeCall: (state) => {
      state.isVisible = false;
      state.isCalling = false;
      state.calleeName = '';
    },
  },
});

export const { startCall, endCall, closeCall } = callSlice.actions;
export default callSlice.reducer;
