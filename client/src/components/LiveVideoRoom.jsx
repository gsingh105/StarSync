import React from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles/index.css'; 
import { Loader2, AlertCircle } from 'lucide-react';

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;

export default function LiveVideoRoom({ token, onEndCall }) {
  
  // 1. Sanitize Token (Handle case where backend sends object)
  const validToken = (typeof token === 'object' && token?.token) ? token.token : token;
  const isTokenString = typeof validToken === 'string' && validToken.length > 0;

  if (!isTokenString) {
      return (
          <div className="h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <p>Error: Invalid Token Format Received</p>
              <button onClick={onEndCall} className="bg-gray-800 px-4 py-2 rounded">Go Back</button>
          </div>
      )
  }

  if (!LIVEKIT_URL) {
      return (
          <div className="h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <p>System Error: VITE_LIVEKIT_URL is missing in .env</p>
              <button onClick={onEndCall} className="bg-gray-800 px-4 py-2 rounded">Go Back</button>
          </div>
      )
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={validToken}
      serverUrl={LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: '100vh', backgroundColor: '#050505' }}
      onDisconnected={onEndCall}
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}