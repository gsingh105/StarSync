import { createToken } from "../config/livekit.js";
import { createSessionRecord, getSessionByIds } from "../dao/sessionDao.js";

export const createLiveSession = ({ userId, astrologerId, role }) => {
  let session = getSessionByIds(userId, astrologerId);

  if (!session) {
    session = {
      sessionId: Date.now().toString(),
      userId,
      astrologerId,
      room: `astro-${astrologerId}-${userId}`,
      status: "active",
      createdAt: new Date()
    };

    createSessionRecord(session);
  }

  const identity = `${role}:${role === "user" ? userId : astrologerId}`;
  const token = createToken(identity, session.room);

  return { token, room: session.room };
};
