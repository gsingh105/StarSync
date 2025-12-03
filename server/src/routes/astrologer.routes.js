import express from "express";
import { 
    addAstrologerController, 
    getAllAstrologersController, 
    getCurrentAstrologer, 
    loginAstrologerController 
} from "../controllers/astrologer.controllers.js";
import { astrologerMiddleware } from "../middlewares/astrologerAuthMiddleware.js";


const router = express.Router();

// Public Routes
router.post("/login", loginAstrologerController);

router.get("/", astrologerMiddleware, getAllAstrologersController);
router.post("/add",astrologerMiddleware, addAstrologerController);
router.get("/current-astrologer",astrologerMiddleware, getCurrentAstrologer);

export default router;