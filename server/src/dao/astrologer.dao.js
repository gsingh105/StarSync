import AstrologerModel from "../models/astrologer.model.js"

export const createAstrologer = async (data) => {
    return await AstrologerModel.create(data)
}

export const findAstrologerByUserId = async (userId) => {
    return await AstrologerModel.findOne({ user: userId })
}

export const findAstrologerByEmail = async (email) => {
    return await AstrologerModel.findOne({ email })
}
