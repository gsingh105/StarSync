import express from "express";
import {
    addAstrologerController,
    getAllAstrologersController,
    getCurrentAstrologer,
    loginAstrologerController,
    logoutAstrolgerController,
    // ADD THESE TWO IMPORTS
    getAstrologerStats,
    getAstrologerReviews
} from "../controllers/astrologer.controllers.js";
import { astrologerMiddleware } from "../middlewares/astrologerAuthMiddleware.js";
import { authMiddleware } from "../middlewares/autMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

router.post("/login", loginAstrologerController);
router.post("/logout", astrologerMiddleware, logoutAstrolgerController);

router.get("/", authMiddleware, getAllAstrologersController);
router.post(
    "/add",
    authMiddleware,
    adminMiddleware,
    upload.single("profileImage"),
    addAstrologerController
);
router.get("/current-astrologer", astrologerMiddleware, getCurrentAstrologer);

router.get("/stats", astrologerMiddleware, getAstrologerStats);
router.get("/reviews", astrologerMiddleware, getAstrologerReviews);

export default router;