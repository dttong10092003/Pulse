import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { hideIncomingCall } from '../../../redux/slice/incomingCallSlice';
import socketCall from '../../../utils/socketCall';
import { acceptedCall, startCall } from '../../../redux/slice/callSlice';

const RINGTONE_URL = "https://res.cloudinary.com/df2amyjzw/video/upload/v1744890393/audiochuong_qdwihw.mp3";

const IncomingCallModal: React.FC<{ setInVideoCall: (v: boolean) => void }> = ({ setInVideoCall }) => {
    const dispatch = useDispatch();
    const call = useSelector((state: RootState) => state.incomingCall);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    // const localStreamRef = useRef<MediaStream | null>(null);
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const userDetails = useSelector((state: RootState) => state.user.userDetails) as {
        firstname?: string;
        lastname?: string;
        avatar?: string;
    };


    useEffect(() => {
        if (call.visible) {
            audioRef.current = new Audio(RINGTONE_URL);
            audioRef.current.loop = true;
            audioRef.current.play().catch((err) => {
                console.warn("🔇 Autoplay blocked:", err);
            });

            // ⏱ Thêm timeout 21s → tự ẩn modal nếu chưa Accept/Decline
            const autoClose = setTimeout(() => {
                console.log("⏳ Người nhận không phản hồi sau 21s → tự tắt modal");
                dispatch(hideIncomingCall());
            }, 21000);

            return () => {
                clearTimeout(autoClose);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
            };
        }
    }, [call.visible, dispatch]);



    const handleAccept = async () => {
        try {
            socketCall.emit("callAccepted", { toUserId: call.fromUserId });
            dispatch(hideIncomingCall());
            dispatch(startCall({
                isVideo: call.isVideo,
                calleeName: `${userDetails.firstname || ''} ${userDetails.lastname || ''}`,
                calleeAvatar: userDetails.avatar || '',
                toUserId: call.fromUserId,
                // fromUserId: currentUser?._id || '',
                fromUserId: call.fromUserId,
                fromName: call.fromName,
                fromAvatar: call.fromAvatar,
                isGroup: call.isGroup,
                groupName: call.groupName,
            }));
            dispatch(acceptedCall());
            setInVideoCall(true);
            console.log("Joining Agora with", call.fromUserId, currentUser?._id);
        } catch (err) {
            console.error("Failed to join Agora:", err);
        }
    };


    const handleDecline = () => {
        console.log('❌ Declined call from', call.fromUserId);
        socketCall.emit("declineCall", {
            toUserId: call.fromUserId, // người gọi
            fromUserId: currentUser?._id, // người từ chối
            fromName: `${userDetails?.firstname || ''} ${userDetails?.lastname || ''}`,
        });
        dispatch(hideIncomingCall());
        socketCall.emit("callRejected", { fromUserId: call.fromUserId });
    };



    if (!call.visible) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50">
            <div className="bg-white dark:bg-[#222] text-black dark:text-white rounded-xl shadow-lg p-6 min-w-[300px] max-w-[90%] pointer-events-auto">
                <div className="text-center space-y-4">
                    <img
                        src={call.isGroup ? call.groupAvatar : call.fromAvatar}
                        alt="avatar"
                        className="w-24 h-24 rounded-full mx-auto"
                    />

                    <h2 className="text-xl font-bold">
                        {call.isGroup ? call.groupName : call.fromName} is calling...
                    </h2>
                    <p>{call.isVideo ? 'Video Call' : 'Voice Call'}</p>

                    <div className="flex justify-center gap-6 mt-4">
                        <button
                            onClick={handleDecline}
                            className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-full text-white cursor-pointer"
                        >
                            Decline
                        </button>
                        <button
                            onClick={handleAccept}
                            className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full text-white cursor-pointer"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default IncomingCallModal;
