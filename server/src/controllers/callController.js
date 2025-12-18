import authModel from "../models/auth.model.js";
import Astrologer from "../models/astrologer.model.js";
import TransactionModel from "../models/transaction.js";

export const initiateCallCheck = async (req, res) => {
    try {
        const { astrologerId, chosenMinutes } = req.body;

        const mins = Number(chosenMinutes);
        if (!astrologerId || isNaN(mins) || mins < 1) {
            return res.status(400).json({ success: false, message: "Invalid request parameters" });
        }

        const user = await authModel.findById(req.user?.id); 
        const astrologer = await Astrologer.findById(astrologerId);

        if (!user || !astrologer) {
            return res.status(404).json({ success: false, message: "User or Astrologer not found" });
        }

        const totalCost = astrologer.price * mins;

        if (user.walletBalance < totalCost) {
            return res.status(402).json({
                success: false,
                message: "Insufficient Balance",
                requiredAmount: totalCost,
                currentBalance: user.walletBalance
            });
        }

        // Just verification - NO DEDUCTION HERE
        res.status(200).json({
            success: true,
            maxDurationSeconds: mins * 60
        });

    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};