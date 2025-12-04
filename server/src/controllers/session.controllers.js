import { createLiveSession } from "../services/session.services.js";

export const createSession = (req, res) => {
  try {
    const { userId, astrologerId, role } = req.body;
    if (!userId || !astrologerId || !role)
      return res.status(400).json({ error: "Missing fields" });

    const data = createLiveSession({ userId, astrologerId, role });
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
