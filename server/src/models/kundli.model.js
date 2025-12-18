import mongoose from "mongoose";

const kundliSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'auth', // Refers to your User model
        required: true,
        unique: true // One user, one saved Kundli
    },
    name: { type: String },
    dob: { type: String }, // DD/MM/YYYY
    tob: { type: String }, // HH:mm
    place: { type: String },
    lat: { type: Number },
    lon: { type: Number },
    // We store the entire API response here as an object
    chartData: { type: Object } 
}, { timestamps: true });

const KundliModel = mongoose.model("Kundli", kundliSchema);
export default KundliModel;