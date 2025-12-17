import { AccessToken } from "livekit-server-sdk";
import dotenv from "dotenv";
dotenv.config();

export const createToken = async (identity, room, name) => {
  // Fallback: If name is undefined, use identity or "User"
  const displayName = name || identity || "User";
  // console.log(`Generating Token for: ${identity} | Name: ${displayName}`);

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { 
      identity,
      name: displayName // <--- LiveKit Video UI uses this
    }
  );
  
  // Method 2: Force set property (for older SDK versions)
  at.name = displayName; 

  at.addGrant({
    roomJoin: true,
    room: room,
    canPublish: true,
    canSubscribe: true,
  });

  return await at.toJwt(); 
};