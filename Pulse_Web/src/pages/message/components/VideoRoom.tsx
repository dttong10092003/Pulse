import React, { useEffect, useState } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';

interface ExtendedUser {
  uid: string | number;
  videoTrack: ICameraVideoTrack;
  audioTrack?: IMicrophoneAudioTrack;
}

const APP_ID = '660ae1f6941a4d9fa5714e4233cef2c5';
const TOKEN =
  '007eJxTYFj6pHTKxvpVv6e3rGB+vDFVbqbDyQM3c9NzxfaFnLloEZCmwGBmZpCYaphmZmlimGiSYpmWaGpuaJJqYmRsnJyaZpRs+mq+UkZDICPDVuFOFkYGCATxmRnKU7IYGADTsiDM';
const CHANNEL = 'wdj';

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
    mode: 'rtc',
    codec: 'vp8',
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
    await waitForConnectionState('DISCONNECTED');

    const uid = await client.join(APP_ID, CHANNEL, TOKEN, null);

    client.on('user-published', async (user: any, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video' && user.videoTrack) {
        onVideoTrack({
          uid: user.uid,
          videoTrack: user.videoTrack,
          audioTrack: user.audioTrack,
        });
      }
      if (mediaType === 'audio' && user.audioTrack) {
        user.audioTrack.play();
      }
    });

    client.on('user-left', (user: any) => {
      onUserDisconnected({ uid: user.uid, videoTrack: user.videoTrack, audioTrack: user.audioTrack });
    });

    tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    await client.publish(tracks);

    return {
      tracks,
      uid,
    };
  };

  const disconnect = async () => {
    await waitForConnectionState('CONNECTED');
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

export const VideoRoom: React.FC = () => {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const uidState = useState<string | number | null>(null);
const setUid = uidState[1];

  useEffect(() => {
    const onVideoTrack = (user: ExtendedUser) => {
      setUsers((prevUsers) => [...prevUsers, user]);
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
      setUsers((prevUsers) => [
        ...prevUsers,
        {
          uid,
          audioTrack: tracks[0],
          videoTrack: tracks[1],
        },
      ]);
    };

    const cleanup = async () => {
      await disconnect();
      setUid(null);
      setUsers([]);
    };

    agoraCommandQueue = agoraCommandQueue.then(setup);
    return () => {
      agoraCommandQueue = agoraCommandQueue.then(cleanup);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[#1a1a1a]">
      <div className="w-full max-w-screen-lg p-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
  
};
