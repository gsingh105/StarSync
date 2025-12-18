import { Router } from "express";
import { initiateCallCheck } from "../controllers/callController.js";
import { authMiddleware } from "../middlewares/autMiddleware.js"; // Match your filename

const router = Router();

router.post("/check-balance", authMiddleware, initiateCallCheck);

export default router;