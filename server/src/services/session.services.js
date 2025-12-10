import { createToken } from "../config/livekit.js";
import { createSessionRecord, getSessionByIds } from "../dao/sessionDao.js";

// 1. Add 'async'
export const createLiveSession = async ({ userId, astrologerId, role }) => {
  
  // 2. Add 'await'
  let session = await getSessionByIds(userId, astrologerId);

  if (!session) {
    session = {
      sessionId: Date.now().toString(),
      userId,
      astrologerId,
      room: `astro-${astrologerId}-${userId}`,
      status: "active",
      createdAt: new Date()
    };
    
    // 3. Add 'await'
    await createSessionRecord(session);
  }

  const identity = `${role}:${role === "user" ? userId : astrologerId}`;
  
  // 4. Pass a default name since we don't have the real name in this flow
  const defaultName = role === "user" ? "User" : "Astrologer";
  
  // 5. Add 'await' and pass the name argument
  const token = await createToken(identity, session.room, defaultName);

  return { token, room: session.room };
};