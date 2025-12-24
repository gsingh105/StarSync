import { findUserById } from "../dao/auth.dao.js";
import { createLiveSession } from "../services/session.services.js";
import jwt from "jsonwebtoken"
import { errorResponse } from "../utils/response.js";

export const createSession = async (req, res, next) => {
  try {
    const { astrologerId } = req.body;
    console.log(astrologerId)

    const accessToken = req.cookies?.accessToken
    const refreshToken = req.cookies?.refreshToken
    // console.log(accessToken)


    if (accessToken) {
      try {
        const decodedUser = jwt.verify(accessToken, process.env.JWT_SECERET_KEY)
        console.log(decodedUser)
        const user = await findUserById(decodedUser.id)
      
        if (!user) return errorResponse(res, "Unauthorized - user not found", 401)

        req.user = user
        return next()
      } catch (err) {
        console.log("Access token expired or invalid:", err.message)
      }
    }


    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized from session" });
    }

    if (!astrologerId) {
      return res.status(400).json({ error: "Astrologer ID required" });
    }

    const userId = req.user._id.toString();
    const role = req.user.role || "user";

    const data = createLiveSession({ userId, astrologerId, role });
    res.json(data);

  } catch (error) {
    next(error)

  }
}
