import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000'); // Địa chỉ của signaling-service

interface Props {
  userId: string;    // ID của bạn
  peerId: string;    // ID người cần gọi
}

const VideoCallDemo: React.FC<Props> = ({ userId, peerId }) => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    socket.emit('join', { userId });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (localVideo.current) localVideo.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection();

      // Gửi stream local lên kết nối peer
      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event) => {
        if (remoteVideo.current) remoteVideo.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { to: peerId, candidate: event.candidate });
        }
      };
    });

    socket.on('incoming-call', async ({ from, offer }) => {
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current?.createAnswer();
      await peerConnection.current?.setLocalDescription(answer!);
      socket.emit('answer-call', { to: from, answer });
    });

    socket.on('call-answered', async ({ answer }) => {
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startCall = async () => {
    const offer = await peerConnection.current?.createOffer();
    await peerConnection.current?.setLocalDescription(offer!);
    socket.emit('call-user', { to: peerId, offer });
  };

  return (
    <div style={{ padding: 20, backgroundColor: '#111', minHeight: '100vh', color: 'white' }}>
      <h2>🔗 Video Call Demo</h2>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <video ref={localVideo} autoPlay muted playsInline style={{ width: '45%', border: '2px solid #555' }} />
        <video ref={remoteVideo} autoPlay playsInline style={{ width: '45%', border: '2px solid #555' }} />
      </div>
      <button
        onClick={startCall}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4ade80',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        📞 Start Call
      </button>
    </div>
  );
};

export default VideoCallDemo;
