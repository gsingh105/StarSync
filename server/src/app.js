import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./utils/errorHanlder.js";


import userRoutes from "./routes/auth.routes.js";
import astrologerRoutes from "./routes/astrologer.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import paymentRoutes from "./routes/payment.routes.js"
import callRoutes from "./routes/call.routes.js"
import reviewRoutes from "./routes/review.routes.js"
import kundliRoutes from "./routes/kundli.routes.js"

const app = express();


const allowedOrigins = [
    "http://localhost:5173", 
    "http://localhost:3000"
];


app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRoutes);
app.use("/api/astrologer", astrologerRoutes);
app.use("/session", sessionRoutes);
app.use("/api/payment",paymentRoutes)
app.use("/api/call", callRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/kundli",kundliRoutes)

app.use(errorHandler);

export default app;