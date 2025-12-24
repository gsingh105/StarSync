import { AccessToken } from "livekit-server-sdk";
import dotenv from "dotenv";
dotenv.config();

export const createToken = async (identity, room, name) => {
  const displayName = name || identity || "User";
  // console.log(`Generating Token for: ${identity} | Name: ${displayName}`);

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { 
      identity,
      name: displayName 
    }
  );
  
  at.name = displayName; 

  at.addGrant({
    roomJoin: true,
    room: room,
    canPublish: true,
    canSubscribe: true,
  });

  return await at.toJwt(); 
};