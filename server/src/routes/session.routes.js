import express from "express";
import { createSession } from "../controllers/session.controllers.js"
import { authMiddleware } from "../middlewares/autMiddleware.js"


const router = express.Router();
router.post("/", createSession);

export default router;
