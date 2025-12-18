import express from "express"
const router = express.Router()
import  { createPaymentIntent, verifyPayment } from "../controllers/paymentController.js"
import { authMiddleware } from "../middlewares/autMiddleware.js";

router.post('/create-payment-intent', authMiddleware, createPaymentIntent);
router.post('/verify-stripe', authMiddleware, verifyPayment);

export default router