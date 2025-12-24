import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth',
        required: true
    },
    astrologerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Astrologer',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1, max: 5
    },
    comment: {
        type: String
    },
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);