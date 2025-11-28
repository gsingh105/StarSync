import { addAstrologerService } from "../services/astrologer.services.js"
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
