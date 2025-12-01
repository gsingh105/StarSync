import express from "express"
import { addAstrologerController, getAllAstrologersController } from "../controllers/astrologer.controllers.js"
import { authMiddleware } from "../middlewares/autMiddleware.js"


const router = express.Router()


router.get("/", authMiddleware, getAllAstrologersController)
router.post("/add", authMiddleware, addAstrologerController)

export default router