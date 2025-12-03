import jwt from "jsonwebtoken";
import AstrologerModel from "../models/astrologer.model.js";
import { NotFoundError, UnauthorizedError } from "../utils/errorHanlder.js";

export const astrologerMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken

    if (!token) throw new NotFoundError("Token not founded")
    const secret = process.env.JWT_SECERET_KEY || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    const astrologer = await AstrologerModel.findOne({ email: decoded.email });

    if (!astrologer) throw new UnauthorizedError("Unauthorized: Astrologer account not found")
    req.astrologer = astrologer;
    req.astrologerId = astrologer._id;

    next();
  } catch (error) {
    next(error)
  }
};