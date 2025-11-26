import userModel from "../models/auth.model.js"


export const createUser = async (fullname, email, password, role = "user", refreshToken) => {
    const userData = {
        fullname,
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
    return await userModel.findById(id).select("-password").populate("addresses")
}

export const updateRefreshToken = async (userId, refreshToken) => {
    return await userModel.findByIdAndUpdate(
        userId,
        { refreshToken },
        { new: true }
    )
}