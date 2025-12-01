import { createAstrologer, findAstrologerByEmail, findAllActiveAstrologers } from "../dao/astrologer.dao.js";
import { ConflictError } from "../utils/errorHanlder.js"; 

export const addAstrologerService = async (astroData) => {
    const existingAstrologer = await findAstrologerByEmail(astroData.email);
    if (existingAstrologer) {
        throw new ConflictError("Astrologer with this email already exists");
    }

    return await createAstrologer(astroData);
}

export const getAllAstrologersService = async (query) => {
    // passing query allows for future pagination or filtering implementation in the DAO
    return await findAllActiveAstrologers();
}