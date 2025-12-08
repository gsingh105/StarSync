import { AccessToken } from "livekit-server-sdk";
import dotenv from "dotenv";
dotenv.config();

export const createToken = (identity, room) => {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity }
  );
  
  // VideoGrant is now part of the AccessToken's video property
  at.addGrant({
    roomJoin: true,
    room: room,
    canPublish: true,
    canSubscribe: true,
  });

  return at.toJwt();
};