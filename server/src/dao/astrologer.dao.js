import Astrologer from "../models/astrologer.model.js";

export const createAstrologer = async (data) => {
    return await Astrologer.create(data);
}

export const findAstrologerByEmail = async (email) => {
    return await Astrologer.findOne({ email });
}

export const findAllActiveAstrologers = async () => {
    return await Astrologer.find({ isActive: true })
        .select("-createdBy")
        .sort({ rating: -1 });
}
export const updateAstrologerById = async (id, updateData) => {
    return await Astrologer.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );
};

export const deleteAstrologerById = async (id) => {
    return await Astrologer.findByIdAndDelete(id);
};