import express from "express";
import { submitReview } from "../controllers/reviewController.js";
import { authMiddleware } from "../middlewares/autMiddleware.js"; // Ensure correct spelling of your middleware

const router = express.Router();

router.post("/submit", authMiddleware, submitReview);

export default router;