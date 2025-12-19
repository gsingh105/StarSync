import { addAstrologerService, getAllAstrologersService, loginAstrologerServices, updateAstrologerService, deleteAstrologerService } from "../services/astrologer.services.js";
import { BadRequestError } from "../utils/errorHanlder.js";
import { successResponse } from "../utils/response.js";
import { cookieOptionsForAcessToken } from "./cookie.config.js";
import { uploadFromBuffer } from "../utils/cloudinary.js";
import CallTransaction from "../models/callTransaction.model.js";
import Review from "../models/review.model.js";
import mongoose from "mongoose";

export const addAstrologerController = async (req, res, next) => {
    try {
        let profileImageUrl = "";

        // Check if file exists in memory (req.file.buffer)
        if (req.file && req.file.buffer) {
            try {
                const cloudinaryResponse = await uploadFromBuffer(req.file.buffer);
                if (cloudinaryResponse) {
                    profileImageUrl = cloudinaryResponse.secure_url;
                }
            } catch (uploadError) {
                console.error("Cloudinary Upload Failed:", uploadError);
                throw new Error("Failed to upload image to cloud");
            }
        }

        // Prepare Data
        const astroData = {
            ...req.body,
            profileImage: profileImageUrl, // Store the Cloudinary URL
            experienceYears: Number(req.body.experienceYears),
            price: Number(req.body.price),
            createdBy: req.user ? req.user._id : null
        };

        if (!astroData.createdBy) {
            throw new BadRequestError("Admin authentication required.");
        }

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
        // console.log(email)
        if (!email) throw new BadRequestError("Email is required")
        const { astrologer, token } = await loginAstrologerServices(email);
        // console.log("astrolger:", astrologer)
        // console.log("token", token)

        res.cookie("accessToken", token, cookieOptionsForAcessToken);
        req.astrologer = astrologer;
        return successResponse(res, "Astrologer logged in successfully", astrologer, 200)

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


export const getAstrologerStats = async (req, res) => {
    try {
        // FIX: Check if your middleware uses req.user or req.astrologer
        const astrologerId = req.astrologer?._id || req.user?.id || req.user?._id;

        if (!astrologerId) {
            return res.status(401).json({ message: "Not authorized: No Astrologer ID found" });
        }

        // Convert string ID to Mongoose ObjectId to ensure query accuracy
        const objId = new mongoose.Types.ObjectId(astrologerId);

        const transactions = await CallTransaction.find({ astrologerId: objId });

        const totalRevenue = transactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const todayTransactions = await CallTransaction.find({
            astrologerId: objId,
            createdAt: { $gte: startOfDay }
        });

        const todayRevenue = todayTransactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

        // Standardized JSON response
        res.status(200).json({
            totalRevenue: totalRevenue.toFixed(2),
            todayRevenue: todayRevenue.toFixed(2),
            totalCalls: transactions.length
        });
    } catch (err) {
        console.error("Stats Error:", err); // Log the actual error to your terminal
        res.status(500).json({ message: "Internal Server Error in Stats" });
    }
};

export const getAstrologerReviews = async (req, res) => {
    try {
        const astrologerId = req.astrologer?._id || req.user?.id || req.user?._id;

        if (!astrologerId) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const reviews = await Review.find({ astrologerId: new mongoose.Types.ObjectId(astrologerId) })
            .populate('userId', 'fullName') // Ensure the User model is registered as 'auth' or 'User'
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json(reviews);
    } catch (err) {
        console.error("Reviews Error:", err);
        res.status(500).json({ message: "Internal Server Error in Reviews" });
    }
};

export const updateAstrologerController = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Clean up data (ensure numbers are numbers)
        const updateData = { ...req.body };
        if (updateData.price) updateData.price = Number(updateData.price);
        if (updateData.experienceYears) updateData.experienceYears = Number(updateData.experienceYears);

        const result = await updateAstrologerService(id, updateData);
        return successResponse(res, "Astrologer updated successfully", result, 200);
    } catch (error) {
        next(error);
    }
};

export const deleteAstrologerController = async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteAstrologerService(id);
        return successResponse(res, "Astrologer deleted successfully", {}, 200);
    } catch (error) {
        next(error);
    }
};