import { AccessToken } from "livekit-server-sdk";
import dotenv from "dotenv";
dotenv.config();

export const createToken = (identity, room) => {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity }
  );
  
  at.addGrant({
    roomJoin: true,
    room: room,
    canPublish: true,
    canSubscribe: true,
  });

  const jwt = at.toJwt();
  return jwt; // Returns a STRING
};