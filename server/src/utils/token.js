import jwt from "jsonwebtoken";

// FIXED: Removed 'async'. jwt.sign is synchronous.
// Keeping 'async' caused it to return a Promise object, which broke the login.
export const signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECERET_KEY, { expiresIn: "1h" });
};

export const signRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESHTOKEN_SECERET_KEY, { expiresIn: "7d" });
};