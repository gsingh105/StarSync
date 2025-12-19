import userModel from "../models/auth.model.js"


export const createUser = async (fullName, email, password, role = "user", refreshToken) => {
    const userData = {
        fullName,
        email,
        password,
        role,
        refreshToken
    }

    return await userModel.create(userData)
}
export const findUserByEmail = async (email) => {
    return await userModel.findOne({ email })
}

export const findUserById = async (id) => {
    return await userModel.findById(id).select("-password")
}

export const updateRefreshToken = async (userId, refreshToken) => {
    return await userModel.findByIdAndUpdate(
        userId,
        { refreshToken },
        { new: true }
    )
}

export const updateUserDetails = async (userId, updateData) => {
    return await userModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select("-password");
};;