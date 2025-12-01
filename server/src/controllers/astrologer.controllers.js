import { addAstrologerService, getAllAstrologersService } from "../services/astrologer.services.js"
import { successResponse } from "../utils/response.js"

export const addAstrologerController = async (req, res, next) => {
    try {
        const astroData = {
            ...req.body,
            createdBy: req.user._id 
        }
        const result = await addAstrologerService(astroData)

        return successResponse(res, "Astrologer added successfully", result, 201)
    } catch (error) {
        next(error)
    }
}

export const getAllAstrologersController = async (req, res, next) => {
    try {
        // passing req.query allows you to handle pagination or filtering in the service if needed
        const result = await getAllAstrologersService()

        return successResponse(res, "Astrologers fetched successfully", result, 200)
    } catch (error) {
        next(error)
    }
}