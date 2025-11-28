import { findUserById, updateRefreshToken } from "../dao/auth.dao.js"
import { googleLoginService, loginUserService, registerUserServices } from "../services/auth.services.js"
import { successResponse, errorResponse } from "../utils/response.js"
import { cookieOptionsForAcessToken, cookieOptionsForRefreshToken } from "./cookie.config.js"
import authModel from "../models/auth.model.js"
import sendEmail from "../utils/sendEmail.js"
import crypto from "crypto"


export const registerUserController = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body
        const { user, accessToken, refreshToken } =
            await registerUserServices(fullName, email, password, "user")

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

// --- Password Reset Logic (Your Changes) ---

export const forgotPasswordController = async (req, res, next) => {
    try {
        const { email } = req.body
        const user = await authModel.findOne({ email })

        if (!user) {
            return errorResponse(res, "Email could not be sent", 404)
        }

        // Get Reset Token
        const resetToken = user.getResetPasswordToken()

        // ValidateBeforeSave: false is important so we don't trip other validation rules
        await user.save({ validateBeforeSave: false })

        // Create Reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

        const message = `You have requested a password reset. Please go to this link to reset your password: \n\n ${resetUrl}`

        try {
            await sendEmail({
                email: user.email,
                subject: "StarSync Password Reset",
                message
            })

            return successResponse(res, "Email sent successfully", {}, 200)

        } catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined
            await user.save({ validateBeforeSave: false })
            return errorResponse(res, "Email could not be sent", 500)
        }
    } catch (error) {
        next(error)
    }
}

export const resetPasswordController = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.resetToken)
            .digest("hex")

        const user = await authModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })

        if (!user) {
            return errorResponse(res, "Invalid or expired token", 400)
        }


        user.password = req.body.password
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save() 

        return successResponse(res, "Password updated successfully", {}, 200)

    } catch (error) {
        next(error)
    }
}

// --- Google Auth Logic (Main Branch Changes) ---

export const googleLoginController = async (req, res, next) => {
  try {
    const { idToken } = req.body

    // Note: Ensure AppError is imported or use errorResponse here if AppError is undefined
    if (!idToken) throw new Error("Google ID token is required") 

    const { user, token, refreshToken } = await googleLoginService(idToken)

    res.cookie("accessToken", token, cookieOptionsForAcessToken)
    res.cookie("refreshToken", refreshToken, cookieOptionsForRefreshToken)

    return successResponse(res, "Login successful", user, 200)
  } catch (err) {
    next(err)
  }
}