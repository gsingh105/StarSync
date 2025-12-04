import React, { useEffect, useState } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  ParticipantTile,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles'; // Default styles
import axios from 'axios';
import { Loader2, PhoneOff } from 'lucide-react';

// Use your VITE_API_URL or fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL; // e.g., wss://your-project.livekit.cloud

export default function LiveVideoRoom({ userId, astrologerId, role, onEndCall }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const initSession = async () => {
      try {
        // Call your backend endpoint: /api/session/create
        // Ensure your express router is mounted at /api/session
        const response = await axios.post(`${API_URL}/api/session/create`, {
          userId,
          astrologerId,
          role // 'user' or 'astrologer'
        });

        setToken(response.data.token);
      } catch (err) {
        console.error("Failed to join session:", err);
        setError("Could not connect to the secure room.");
      }
    };

    if (userId && astrologerId && role) {
      initSession();
    }
  }, [userId, astrologerId, role]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050505] text-red-500">
        <p>{error}</p>
        <button onClick={onEndCall} className="mt-4 text-amber-500 underline">Go Back</button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050505] text-amber-500 gap-2">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="font-cinzel tracking-widest">Entering Sanctum...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: '100vh', backgroundColor: '#050505' }}
      onDisconnected={onEndCall}
    >
      {/* VideoConference is the all-in-one UI. 
         It handles grid layout, controls, and active speaker.
      */}
      <VideoConference />
      
      {/* Ensures audio plays for all participants */}
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}