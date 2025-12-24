import Review from "../models/review.model.js";
import Astrologer from "../models/astrologer.model.js";
import mongoose from "mongoose"

export const submitReview = async (req, res) => {
  try {
    const { astrologerId, rating, comment } = req.body;
    const userId = req.user.id; 

    if (!astrologerId || !rating) {
      return res.status(400).json({ success: false, message: "Rating and Astrologer ID are required" });
    }

    await Review.create({
      userId,
      astrologerId,
      rating: Number(rating),
      comment,
    });

    const stats = await Review.aggregate([
      { $match: { astrologerId: new mongoose.Types.ObjectId(astrologerId) } },
      {
        $group: {
          _id: "$astrologerId",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Astrologer.findByIdAndUpdate(astrologerId, {
        rating: stats[0].avgRating.toFixed(1), 
      });
    }

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Review Submission Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};