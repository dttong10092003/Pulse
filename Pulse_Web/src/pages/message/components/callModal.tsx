import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { closeCall, endCall, startCall } from '../../../redux/slice/callSlice';

const CallModal: React.FC = () => {
  const dispatch = useDispatch();
  const call = useSelector((state: RootState) => state.call);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (call.isCalling) {
      // 🔊 Phát tiếng chuông từ Cloudinary
      audioRef.current = new Audio('https://res.cloudinary.com/df2amyjzw/video/upload/v1744890393/audiochuong_qdwihw.mp3');
      audioRef.current.loop = true;

      audioRef.current.play().catch((err) => {
        console.warn('Cannot autoplay ringtone:', err);
      });
    }

    // ⏱ Kết thúc cuộc gọi sau 10s
    const timeout = setTimeout(() => {
      dispatch(endCall());
    }, 10000);

    return () => {
      clearTimeout(timeout);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [call.isCalling]);

  if (!call.isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="bg-white dark:bg-[#222] text-black dark:text-white rounded-xl shadow-xl p-6 w-[300px] max-w-[90%] pointer-events-auto">
        <div className="mb-6 text-center">
          <img
            src={call.calleeAvatar}
            alt="avatar"
            className="w-24 h-24 rounded-full mx-auto"
          />
          <h2 className="mt-4 text-xl font-bold">{call.calleeName}</h2>
          <p className="text-gray-500">{call.isCalling ? 'Calling...' : 'The call has ended.'}</p>
        </div>

        <div className="flex justify-center gap-4">
          {!call.isCalling && (
            <button
              className="bg-green-600 px-5 py-2 rounded-full hover:bg-green-700"
              onClick={() =>
                dispatch(startCall({
                  isVideo: call.isVideo,
                  calleeName: call.calleeName,
                  calleeAvatar: call.calleeAvatar,
                }))
              }
            >
              Call back
            </button>
          )}
          <button
            className="bg-red-600 px-5 py-2 rounded-full hover:bg-red-700"
            onClick={() => dispatch(closeCall())}
          >
            {call.isCalling ? 'Cancel' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );

};

export default CallModal;
