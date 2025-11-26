import { createUser, findUserByEmail, updateRefreshToken } from "../dao/auth.dao.js"
import { AppError, BadRequestError, ConflictError } from "../utils/errorHanlder.js"
import { signToken, signRefreshToken } from "../utils/token.js"

export const registerUserServices = async (fullname, email, password, role = "user") => {
    
    const userAlreadyExists = await findUserByEmail(email)
    if (userAlreadyExists) throw new ConflictError("User already exists")

    const newUser = await createUser(fullname, email, password, role)
    if (!newUser) throw new AppError("User creation failed")

    const accessToken = await signToken({ id: newUser._id, email: newUser.email, role: newUser.role })
    if (!accessToken) throw new AppError("Access token generation failed")

    const refreshToken = await signRefreshToken({ id: newUser._id, email: newUser.email })
    if (!refreshToken) throw new AppError("Refresh token generation failed")

    const updatedUser = await updateRefreshToken(newUser._id, refreshToken)

    return { user: updatedUser, accessToken, refreshToken }
}


export const loginUserService = async (email, password) => {
    
    const existingUser = await findUserByEmail(email)
    if (!existingUser) throw new BadRequestError("Invalid email or password")

    const isPasswordValid = await existingUser.comparePassword(password)
    if (!isPasswordValid) throw new BadRequestError("Invalid email or password")

    const accessToken = await signToken({ id: existingUser._id, email: existingUser.email, role: existingUser.role })
    if (!accessToken) throw new AppError("Access token generation failed")

    const refreshToken = await signRefreshToken({ id: existingUser._id, email: existingUser.email })
    if (!refreshToken) throw new AppError("Refresh token generation failed")

    const updatedUser = await updateRefreshToken(existingUser._id, refreshToken)

    return { user: updatedUser, accessToken, refreshToken }
}
