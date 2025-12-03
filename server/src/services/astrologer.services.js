import { createAstrologer, findAstrologerByEmail, findAllActiveAstrologers } from "../dao/astrologer.dao.js";
import { ConflictError } from "../utils/errorHanlder.js"; // Check spelling of errorHandler
import AstrologerModel from '../models/astrologer.model.js';
import { signToken } from "../utils/token.js";

export const addAstrologerService = async (astroData) => {
    const existingAstrologer = await findAstrologerByEmail(astroData.email);
    if (existingAstrologer) {
        throw new ConflictError("Astrologer with this email already exists");
    }
    // Ideally, hash password here before creating
    return await createAstrologer(astroData);
}

export const getAllAstrologersService = async (query) => {
    return await findAllActiveAstrologers();
}

export const loginAstrologerServices = async (email, password) => {
    // 1. Find Astrologer
    // explicitly select password if it's set to select: false in model
    const astrologer = await AstrologerModel.findOne({ email });
    // console.log(astrologer)

    if (!astrologer) {
        const error = new Error("Invalid credentials"); // Generic message for security
        error.statusCode = 401;
        throw error;
    }

    // 3. Generate Token
    const tokenPayload = {
        email: astrologer.email,
    };

    const token =  signToken(tokenPayload); // Helper is synchronous/async compatible now
    // console.log("token:", token)

    const astrologerData = astrologer.toObject();
    delete astrologerData.password; // Don't send password back

    return { astrologer: astrologerData, token };
};