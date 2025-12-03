import jwt from "jsonwebtoken";
import AstrologerModel from "../models/astrologer.model.js";

export const astrologerMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken 

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }
    const secret = process.env.JWT_SECERET_KEY || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    
    const astrologer = await AstrologerModel.findOne({ email: decoded.email });

    if (!astrologer) {
        return res.status(401).json({ success: false, message: "Unauthorized: Astrologer account not found" });
    }
    req.astrologer = astrologer;
    req.astrologerId = astrologer._id; 
    
    next();
  } catch (error) {
    console.error("Astrologer Auth Error:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  } 
};