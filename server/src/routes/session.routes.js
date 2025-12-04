import express from "express";
import { createSession} from "../controllers/session.controllers.js"

const router = express.Router();
router.post("/create", createSession);

export default router;
