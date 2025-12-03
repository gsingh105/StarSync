import { addAstrologerService, getAllAstrologersService, loginAstrologerServices } from "../services/astrologer.services.js";
import { successResponse } from "../utils/response.js";

const cookieOptionsForAccessToken = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000 
};

export const addAstrologerController = async (req, res, next) => {
    try {
        const astroData = {
            ...req.body,
            createdBy: req.user ? req.user._id : null 
        };
        const result = await addAstrologerService(astroData);
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
        
        if (!email) {
            const error = new Error("Please provide both email and password");
            error.statusCode = 400;
            throw error;
        }


        const { astrologer, token } = await loginAstrologerServices(email);

        res.cookie("accessToken", token, cookieOptionsForAccessToken);
        req.astrologer = astrologer;

        res.status(200).json({
            success: true,
            message: "Astrologer logged in successfully",
            token, 
            astrologer
        });

    } catch (error) {
        next(error);
    }
};

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