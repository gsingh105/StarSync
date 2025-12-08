import { createAstrologer, findAstrologerByEmail, findAllActiveAstrologers } from "../dao/astrologer.dao.js";
import { ConflictError, NotFoundError } from "../utils/errorHanlder.js"; // Check spelling of errorHandler
import AstrologerModel from '../models/astrologer.model.js';
import { signToken } from "../utils/token.js";

export const addAstrologerService = async (astroData) => {
    console.log(astroData)
    const existingAstrologer = await findAstrologerByEmail(astroData.email);
    if (existingAstrologer) {
        throw new ConflictError("Astrologer with this email already exists");
    }
    return await createAstrologer(astroData);
}

export const getAllAstrologersService = async (query) => {
    return await findAllActiveAstrologers();
}

export const loginAstrologerServices = async (email, password) => {
    const astrologer = await AstrologerModel.findOne({ email });

    if (!astrologer) throw new NotFoundError("User not found")
    const tokenPayload = {
        email: astrologer.email,
    };

    const token = signToken(tokenPayload);


    const astrologerData = astrologer.toObject();
    delete astrologerData.password; 

    return { astrologer: astrologerData, token };
};