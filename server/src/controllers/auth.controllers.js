import { findUserById, updateRefreshToken } from "../dao/auth.dao.js"
import { googleLoginService, loginUserService, registerUserServices } from "../services/auth.services.js"
import { successResponse } from "../utils/response.js"
import { cookieOptionsForAcessToken, cookieOptionsForRefreshToken } from "./cookie.config.js"

export const registerUserController = async (req, res, next) => {
    try {
        const { fullName, email, password, role } = req.body

        const { user, accessToken, refreshToken } =
            await registerUserServices(fullName, email, password, role)

        res.cookie("accessToken", accessToken, cookieOptionsForAcessToken)
        res.cookie("refreshToken", refreshToken, cookieOptionsForRefreshToken)

        return successResponse(res, "User registered successfully", user, 201)

    } catch (error) {
        next(error)
    }
}


export const loginUserController = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const { user, accessToken, refreshToken } =
            await loginUserService(email, password)

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")

        res.cookie("accessToken", accessToken, cookieOptionsForAcessToken)
        res.cookie("refreshToken", refreshToken, cookieOptionsForRefreshToken)

        return successResponse(res, "User logged in successfully", user, 200)

    } catch (error) {
        next(error)
    }
}

export const logoutUserController = async (req, res, next) => {
    try {
        if (req.user?.id) {
            await updateRefreshToken(req.user.id, null)
        }
        res.clearCookie("accessToken", cookieOptionsForAcessToken)
        res.clearCookie("refreshToken", cookieOptionsForRefreshToken)

        return successResponse(res, "Logout succesfull", 200)
    } catch (error) {
        next(error)
    }

}

export const getCurrentUserController = async (req, res, next) => {
    try {
        const currentUser = await findUserById(req.user._id)
        return successResponse(res, "Current user fetched successfully", currentUser, 200)
    } catch (error) {
        next(error)
    }
}


export const googleLoginController = async (req, res, next) => {
  try {
    const { idToken } = req.body

    if (!idToken) throw new AppError("Google ID token is required", 400)

    const { user, token, refreshToken } = await googleLoginService(idToken)

    res.cookie("accessToken", token, cookieOptionsForAcessToken)
    res.cookie("refreshToken", refreshToken, cookieOptionsForRefreshToken)

    return successResponse(res, "Login successful", user, 200)
  } catch (err) {
    next(err)
  }
}