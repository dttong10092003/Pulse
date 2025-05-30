import React, { useEffect, useRef, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
interface ExtendedUser {
  uid: string | number;
  videoTrack?: ICameraVideoTrack;
  audioTrack?: IMicrophoneAudioTrack;
}
interface VideoRoomProps {
  onLeaveCall: () => void;
}
const APP_ID = "660ae1f6941a4d9fa5714e4233cef2c5";
const TOKEN =
  "007eJxTYGDf89z/tHJZ4rryuW4GFoVawbou4WVKCs32l9ZsWSYu80yBwczMIDHVMM3M0sQw0STFMi3R1NzQJNXEyNg4OTXNKNk0T9cqoyGQkWFeTisrIwMEgvjMDOUpWQwMAFqoHBE=";
const CHANNEL = "wdj";

AgoraRTC.setLogLevel(4);

let agoraCommandQueue = Promise.resolve();

interface CreateAgoraClientParams {
  onVideoTrack: (user: ExtendedUser) => void;
  onUserDisconnected: (user: ExtendedUser) => void;
}

const createAgoraClient = ({
  onVideoTrack,
  onUserDisconnected,
}: CreateAgoraClientParams) => {
  const client: IAgoraRTCClient = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
  });

  let tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];

  const waitForConnectionState = (connectionState: string) => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (client.connectionState === connectionState) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  };

  const connect = async () => {
    await waitForConnectionState("DISCONNECTED");

    const uid = await client.join(APP_ID, CHANNEL, TOKEN, null);

    client.on("user-published", async (user: any, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "video" && user.videoTrack) {
        onVideoTrack({
          uid: user.uid,
          videoTrack: user.videoTrack,
          audioTrack: user.audioTrack,
        });
      }
      if (mediaType === "audio" && user.audioTrack) {
        user.audioTrack.play();
      }
    });
    client.on("user-unpublished", (user: any, mediaType) => {
      if (mediaType === "video") {
        // Cập nhật danh sách user → tắt videoTrack
        onVideoTrack({
          uid: user.uid,
          videoTrack: undefined, // hoặc null tùy logic
          audioTrack: user.audioTrack,
        });
      }
    });
    client.on("user-left", (user: any) => {
      onUserDisconnected({
        uid: user.uid,
        videoTrack: user.videoTrack,
        audioTrack: user.audioTrack,
      });
    });

    tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    await client.publish(tracks);

    return {
      tracks,
      uid,
    };
  };

  const disconnect = async () => {
    await waitForConnectionState("CONNECTED");
    client.removeAllListeners();
    for (const track of tracks) {
      track.stop();
      track.close();
    }
    await client.unpublish(tracks);
    await client.leave();
  };

  return {
    connect,
    disconnect,
  };
};

export const VideoRoom: React.FC<VideoRoomProps> = ({ onLeaveCall }) => {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const uidState = useState<string | number | null>(null);
  const setUid = uidState[1];
  const [callDuration, setCallDuration] = useState<number>(0); // tính bằng giây
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [localTracks, setLocalTracks] = useState<
    [IMicrophoneAudioTrack, ICameraVideoTrack] | null
  >(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  useEffect(() => {
    const onVideoTrack = (user: ExtendedUser) => {
      setUsers((prevUsers) => {
        const existIndex = prevUsers.findIndex((u) => u.uid === user.uid);
        if (existIndex !== -1) {
          const updated = [...prevUsers];
          updated[existIndex] = {
            ...updated[existIndex],
            videoTrack: user.videoTrack,
            audioTrack: user.audioTrack,
          };
          return updated;
        } else {
          return [...prevUsers, user];
        }
      });
    };

    const onUserDisconnected = (user: ExtendedUser) => {
      setUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
    };

    const { connect, disconnect } = createAgoraClient({
      onVideoTrack,
      onUserDisconnected,
    });

    const setup = async () => {
      const { tracks, uid } = await connect();
      setUid(uid);
      setLocalTracks(tracks);
      setUsers((prevUsers) => [
        ...prevUsers,
        {
          uid,
          audioTrack: tracks[0],
          videoTrack: tracks[1],
        },
      ]);

      // ✅ Bắt đầu đếm giây mỗi 1s
      intervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    };

    const cleanup = async () => {
      await disconnect();
      setUid(null);
      setUsers([]);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    agoraCommandQueue = agoraCommandQueue.then(setup);
    return () => {
      agoraCommandQueue = agoraCommandQueue.then(cleanup);
    };
  }, []);

  // return (
  //   <div className="relative w-full h-screen bg-black overflow-hidden">

  //     {/* Time góc phải trên */}
  //     <div className="absolute top-4 right-4 z-20 text-white bg-zinc-800 px-4 py-2 rounded-full shadow">
  //       🕒 {Math.floor(callDuration / 60)}m {callDuration % 60}s
  //     </div>

  //     {/* Main video area */}
  //     <div className="w-full h-full relative">
  //       {users.length === 2 ? (
  //         <>
  //           {/* Remote full-screen */}
  //           <div className="absolute inset-0 z-0">
  //             {users
  //               .filter((u) => u.videoTrack && u.uid !== uidState[0])
  //               .map((user) => (
  //                 <VideoPlayer
  //                   key={user.uid}
  //                   user={{
  //                     uid: user.uid,
  //                     videoTrack: user.videoTrack!,
  //                     audioTrack: user.audioTrack,
  //                   }}
  //                 />
  //               ))}
  //           </div>

  //           {/* Local nhỏ góc phải dưới */}
  //           <div className="absolute bottom-4 right-4 z-10 w-40 h-28 rounded-md overflow-hidden border-2 border-white shadow-md">
  //             {users
  //               .filter((u) => u.videoTrack && u.uid === uidState[0])
  //               .map((user) => (
  //                 <VideoPlayer
  //                   key={user.uid}
  //                   user={{
  //                     uid: user.uid,
  //                     videoTrack: user.videoTrack!,
  //                     audioTrack: user.audioTrack,
  //                   }}
  //                 />
  //               ))}
  //           </div>
  //         </>
  //       ) : (
  //         <div className="w-full max-w-screen-lg p-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2">
  //           {users
  //             .filter((user) => user.videoTrack)
  //             .map((user) => (
  //               <VideoPlayer
  //                 key={user.uid}
  //                 user={{
  //                   uid: user.uid,
  //                   videoTrack: user.videoTrack!,
  //                   audioTrack: user.audioTrack,
  //                 }}
  //               />
  //             ))}
  //         </div>
  //       )}
  //     </div>

  //     {/* Điều khiển Call – cố định đáy giữa */}
  //     <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-6">
  //       {/* Mute/Unmute Mic */}
  //       <button
  //         onClick={() => {
  //           if (!localTracks) return;
  //           const newMicState = !isMicOn;
  //           localTracks[0].setEnabled(newMicState);
  //           setIsMicOn(newMicState);
  //         }}
  //         className="bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded-full shadow-lg transition"
  //       >
  //         {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
  //       </button>

  //       {/* Toggle Camera */}
  //       <button
  //         onClick={() => {
  //           if (!localTracks) return;
  //           const newCamState = !isCamOn;
  //           localTracks[1].setEnabled(newCamState);
  //           setIsCamOn(newCamState);
  //         }}
  //         className="bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded-full shadow-lg transition"
  //       >
  //         {isCamOn ? <Video size={22} /> : <VideoOff size={22} />}
  //       </button>
  //             {/* Leave Call */}
  //       <button
  //         onClick={onLeaveCall}
  //         className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition"
  //       >
  //         <PhoneOff size={24} />
  //       </button>

  //     </div>

  //   </div>
  // );

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Call Duration */}
      <div className="absolute top-4 right-4 z-20 text-white bg-zinc-800 px-4 py-2 rounded-full shadow">
        🕒 {Math.floor(callDuration / 60)}m {callDuration % 60}s
      </div>

      {/* Grid Layout */}
      <div
        className="w-full h-full grid gap-4 p-4"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {users
          .filter((u) => u.videoTrack)
          .map((user) => (
            <VideoPlayer
              key={user.uid}
              user={{
                uid: user.uid,
                videoTrack: user.videoTrack!,
                audioTrack: user.audioTrack,
              }}
            />
          ))}
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-6">
        <button
          onClick={() => {
            if (!localTracks) return;
            const next = !isMicOn;
            localTracks[0].setEnabled(next);
            setIsMicOn(next);
          }}
          className="bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded-full shadow-lg"
        >
          {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
        </button>

        <button
          onClick={() => {
            if (!localTracks) return;
            const next = !isCamOn;
            localTracks[1].setEnabled(next);
            setIsCamOn(next);
          }}
          className="bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded-full shadow-lg"
        >
          {isCamOn ? <Video size={22} /> : <VideoOff size={22} />}
        </button>

        <button
          onClick={onLeaveCall}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
};
