import express from "express"
import { addAstrologerController } from "../controllers/astrolger.controllers.js"
import { authMiddleware } from "../middlewares/autMiddleware.js"
import { adminMiddleware } from "../middlewares/adminMiddleware.js"

const router = express.Router()

router.post("/add", authMiddleware, adminMiddleware,addAstrologerController)

export default router
