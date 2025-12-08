import { addAstrologerService, getAllAstrologersService, loginAstrologerServices } from "../services/astrologer.services.js";
import { BadRequestError } from "../utils/errorHanlder.js";
import { successResponse } from "../utils/response.js";
import { cookieOptionsForAcessToken } from "./cookie.config.js";

export const addAstrologerController = async (req, res, next) => {
    try {
        const astroData = {
            ...req.body,
            createdBy: req.user ? req.user._id : null
        };
        // console.log(astroData)
        const result = await addAstrologerService(astroData);
        // console.log(result)
        return successResponse(res, "Astrologer added successfully", result, 201);
    } catch (error) {
        next(error);
    }
};

export const getAllAstrologersController = async (req, res, next) => {
    try {
        const result = await getAllAstrologersService();
        return successResponse(res, "Astrologers fetched successfully", result, 200);
    } catch (error) {
        next(error);
    }
};

export const loginAstrologerController = async (req, res, next) => {
    try {
        const { email } = req.body;
        // console.log(email)
        if (!email) throw new BadRequestError("Email is required")
        const { astrologer, token } = await loginAstrologerServices(email);
        // console.log("astrolger:", astrologer)
        // console.log("token", token)

        res.cookie("accessToken", token, cookieOptionsForAcessToken);
        req.astrologer = astrologer;
        return successResponse(res,"Astrologer logged in successfully",astrologer,200)

    } catch (error) {
        next(error);
    }
};

export const logoutAstrolgerController = async (req, res, next) => {
    try {
        res.clearCookie("accessToken", cookieOptionsForAcessToken)
        return successResponse(res, "Astrologer logout successfully", 200)
    } catch (error) {
        next(error)
    }

}

export const getCurrentAstrologer = async (req, res, next) => {
    try {
        if (req.astrologer) {
            return successResponse(res, "Astrologer found successfully", req.astrologer, 200);
        } else {
            throw new Error("Astrologer not found in context");
        }
    } catch (error) {
        next(error);
    }
};