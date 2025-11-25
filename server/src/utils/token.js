import jwt from "jsonwebtoken"

export const signToken = async (payload) => {
    return jwt.sign(payload, process.env.JWT_SECERET_KEY, { expiresIn: "1h" })

}
export const signRefreshToken = async(payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESHTOKEN_SECERET_KEY, { expiresIn: "7d" })
}