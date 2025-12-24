import mongoose from "mongoose";

const kundliSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth',
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    dob: {
        type: String
    },
    tob: {
        type: String
    },
    place: {
        type: String
    },
    lat: {
        type: Number
    },
    lon: {
        type: Number
    },
    chartData: {
        type: Object
    }
}, { timestamps: true });

const KundliModel = mongoose.model("Kundli", kundliSchema);
export default KundliModel;