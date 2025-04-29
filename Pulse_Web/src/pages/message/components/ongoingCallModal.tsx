import React, { useState } from "react";
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import socketCall from "../../../utils/socketCall";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface OngoingCallModalProps {
  callerName: string;
  callerAvatar: string;
  calleeName: string;
  calleeAvatar: string;
  onEndCall: () => void;
  localStream: MediaStream | null;
}

const OngoingCallModal: React.FC<OngoingCallModalProps> = ({
  callerName,
  callerAvatar,
  calleeName,
  calleeAvatar,
  onEndCall,
  localStream,
}) => {
  const currentCall = useSelector((state: RootState) => state.call);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const handleEndCall = () => {
    if (currentCall.toUserId) {
      socketCall.emit('endCall', { toUserId: currentCall.toUserId });
    } else if (currentCall.fromUserId) {
      socketCall.emit('endCall', { toUserId: currentCall.fromUserId });
    }
    onEndCall();
  };

  const handleToggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(prev => !prev); // 🔥 Toggle luôn icon
    }
  };

  const handleToggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(prev => !prev); // 🔥 Toggle luôn icon
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      <div className="flex items-center gap-10 mb-10">
        {/* Người gọi */}
        <div className="flex flex-col items-center">
          <img src={callerAvatar} alt="caller" className="w-24 h-24 rounded-full object-cover mb-2" />
          <span className="text-white font-semibold">{callerName}</span>
        </div>

        {/* Người được gọi */}
        <div className="flex flex-col items-center">
          <img src={calleeAvatar} alt="callee" className="w-24 h-24 rounded-full object-cover mb-2" />
          <span className="text-white font-semibold">{calleeName}</span>
        </div>
      </div>

      {/* Các nút chức năng */}
      <div className="flex items-center gap-8">
        <button
          onClick={handleToggleMic}
          className="bg-gray-700 hover:bg-gray-600 p-4 rounded-full cursor-pointer"
        >
          {isMuted ? <MicOff size={28} className="text-white" /> : <Mic size={28} className="text-white" />}
        </button>

        <button
          onClick={handleToggleCamera}
          className="bg-gray-700 hover:bg-gray-600 p-4 rounded-full cursor-pointer"
        >
          {isCameraOff ? <VideoOff size={28} className="text-white" /> : <Video size={28} className="text-white" />}
        </button>

        <button
          onClick={handleEndCall}
          className="bg-red-600 hover:bg-red-500 p-4 rounded-full cursor-pointer"
        >
          <PhoneOff size={28} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default OngoingCallModal;
