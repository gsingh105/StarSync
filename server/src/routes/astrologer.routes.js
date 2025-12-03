import express from "express";
import { 
    addAstrologerController, 
    getAllAstrologersController, 
    getCurrentAstrologer, 
    loginAstrologerController 
} from "../controllers/astrologer.controllers.js";
import { astrologerMiddleware } from "../middlewares/astrologerAuthMiddleware.js";
import { authMiddleware } from "../middlewares/autMiddleware.js";


const router = express.Router();

// Public Routes
router.post("/login", loginAstrologerController);

router.get("/", authMiddleware, getAllAstrologersController);
router.post("/add",astrologerMiddleware, addAstrologerController);
router.get("/current-astrologer",astrologerMiddleware, getCurrentAstrologer);

export default router;