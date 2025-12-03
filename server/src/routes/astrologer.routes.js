import express from "express";
import { 
    addAstrologerController, 
    getAllAstrologersController, 
    getCurrentAstrologer, 
    loginAstrologerController, 
    logoutAstrolgerController
} from "../controllers/astrologer.controllers.js";
import { astrologerMiddleware } from "../middlewares/astrologerAuthMiddleware.js";
import { authMiddleware } from "../middlewares/autMiddleware.js";


const router = express.Router();

router.post("/login", loginAstrologerController);
router.post("/logout",astrologerMiddleware,logoutAstrolgerController)

router.get("/", authMiddleware, getAllAstrologersController);
router.post("/add",astrologerMiddleware, addAstrologerController);
router.get("/current-astrologer",astrologerMiddleware, getCurrentAstrologer);

export default router;