// Example DAO functions (mocked)
const sessions = []; // Replace with MongoDB or SQL

export const createSessionRecord = (sessionData) => {
  sessions.push(sessionData);
  return sessionData;
};

export const getSessionByIds = (userId, astrologerId) => {
  return sessions.find(
    s => s.userId === userId && s.astrologerId === astrologerId && s.status === "active"
  );
};

export const endSession = (sessionId) => {
  const session = sessions.find(s => s.sessionId === sessionId);
  if (session) session.status = "ended";
  return session;
};
