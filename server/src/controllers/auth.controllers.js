import { loginUserService, registerUserServices } from "../services/auth.services.js"
import { successResponse } from "../utils/response.js"
import { cookieOptionsForAcessToken, cookieOptionsForRefreshToken } from "./cookie.config.js"

export const registerUserController = async (req, res, next) => {
    try {
        const { fullname, email, password, role } = req.body

        const { user, accessToken, refreshToken } = 
            await registerUserServices(fullname, email, password, role)

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
