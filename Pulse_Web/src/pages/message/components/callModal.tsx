import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { acceptedCall, closeCall, endCall, rejectedCall, startCall } from '../../../redux/slice/callSlice';
import socketCall from '../../../utils/socketCall';
import socket from '../../../utils/socket';

interface Message {
  conversationId: string;
  senderId: string;
  name: string;
  content: string;
  type: string;
  timestamp: string;
  isDeleted: boolean;
  isSentByUser: boolean;
  isPinned: boolean;
  senderAvatar: string;
}
interface CallModalProps {
  setInVideoCall: (v: boolean) => void;
  setCallStartTime: React.Dispatch<React.SetStateAction<Date | null>>;
}
const CallModal: React.FC<CallModalProps> = ({ setInVideoCall, setCallStartTime }) => {

  const dispatch = useDispatch();
  const call = useSelector((state: RootState) => state.call);
  const currentUser = useSelector((state: RootState) => state.auth.user); // Add this line to get currentUser from Redux (adjust path if needed)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const selectedConversation = useSelector((state: RootState) => state.chat.selectedConversation);
  const userDetail = useSelector((state: RootState) => state.auth.userDetail);


  useEffect(() => {
    socketCall.on('callAccepted', async () => {
      try {

        dispatch(acceptedCall());
        setInVideoCall(true);
        setCallStartTime(new Date());
      } catch (err) {
        console.error("Failed to join Agora:", err);
      }

    });

    return () => {
      socketCall.off('callAccepted');
    };
  }, [dispatch, call.isVideo]);



  useEffect(() => {
    socketCall.on("callDeclined", ({ fromName }) => {
      console.log(`${fromName} declined the call`);

      dispatch(rejectedCall());
      dispatch(endCall());
    });

    return () => {
      socketCall.off("callDeclined");
    };
  }, []);

  useEffect(() => {
    if (call.isCalling) {
      // 🔊 Phát tiếng chuông từ Cloudinary
      audioRef.current = new Audio('https://res.cloudinary.com/df2amyjzw/video/upload/v1744890393/audiochuong_qdwihw.mp3');
      audioRef.current.loop = true;

      audioRef.current.play().catch((err) => {
        console.warn('Cannot autoplay ringtone:', err);
      });
    }

    let timeout: NodeJS.Timeout;

    // if (call.isCalling && !call.isOngoing) {
    //   timeout = setTimeout(() => {
    //     dispatch(endCall());
    //   }, 20000); // 10s mới tắt nếu chưa nhận
    // }
    if (call.isCalling && !call.isOngoing) {
      timeout = setTimeout(() => {
        // Nếu người kia không accept sau 20 giây → gọi là cuộc gọi nhỡ
        dispatch(endCall());
        socketCall.emit("callTimeout", {
          toUserId: call.toUserId,
          fromUserId: call.fromUserId,
        });
        console.log(" Timeout → Gửi callTimeout tới", call.toUserId);


        if (call.fromUserId && call.toUserId && call.fromUserId === currentUser?._id) {
          const missedCallMessage: Message = {
            conversationId: selectedConversation?._id || '',
            senderId: currentUser._id,
            name: `${userDetail?.firstname || ''} ${userDetail?.lastname || ''}`,
            content: '📞 You missed the call',
            type: 'text',
            timestamp: new Date().toISOString(),
            isDeleted: false,
            isSentByUser: true,
            isPinned: false,
            senderAvatar: userDetail?.avatar || '',
          };

          socket.emit('sendMessage', missedCallMessage);
        }
      }, 20000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [call.isCalling, call.isOngoing]); // 👈 nhớ thêm call.isOngoing vào dependency


  if (!call.isVisible && !call.isOngoing) return null;

  return (
    <>

      <div className="fixed bottom-5 right-5 z-50">
        <div className="bg-white dark:bg-[#222] text-black dark:text-white rounded-xl shadow-xl p-6 w-[300px] max-w-[90%] pointer-events-auto">
          <div className="mb-6 text-center">
            <img
              src={call.calleeAvatar}
              alt="avatar"
              className="w-24 h-24 rounded-full mx-auto"
            />
            <h2 className="mt-4 text-xl font-bold">{call.calleeName}</h2>
            <p className="text-gray-500">
              {call.rejectedByCallee
                ? 'The call was declined.'
                : call.isCalling
                  ? 'Calling...'
                  : 'The call has ended.'}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {!call.isCalling && (
              <button
                className="bg-green-600 px-5 py-2 rounded-full hover:bg-green-700"
                onClick={() => {
                  dispatch(startCall({
                    isVideo: call.isVideo,
                    calleeName: call.calleeName,
                    calleeAvatar: call.calleeAvatar,
                    toUserId: call.toUserId,
                    fromUserId: call.fromUserId,
                    fromName: call.fromName,
                    fromAvatar: call.fromAvatar,
                    isGroup: call.isGroup,
                    groupName: call.groupName,

                  }));

                  // Gửi lại socket thông báo gọi
                  setTimeout(() => {
                    socketCall.emit("incomingCall", {
                      toUserId: call.toUserId,
                      fromUserId: call.fromUserId,
                      fromName: call.fromName,
                      fromAvatar: call.fromAvatar,
                      isVideo: call.isVideo,
                      isGroup: call.isGroup || false,
                      groupName: call.groupName || undefined,
                    });
                  }, 100);
                }}
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

    </>
  );

};

export default CallModal;
