import { findAstrologerByEmail } from "../dao/astrologer.dao.js"
import Astrologer from "../models/astrologer.model.js"
import { AppError } from "../utils/errorHanlder.js"

export const addAstrologerService = async (astroData) => {
    const { email, phone } = astroData

    const existingAstrologer = await findAstrologerByEmail(email)
    if (existingAstrologer) {
        throw new AppError("Astrologer with this email or phone already exists", 409)
    }

    const newAstrologer = await Astrologer.create(astroData)
    return newAstrologer
}
