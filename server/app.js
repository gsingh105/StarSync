import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors" 
import connectDB from "./src/config/db.config.js"
import { errorHandler } from "./src/utils/errorHandler.js"
import userRoutes from "./src/routes/auth.routes.js"

const app = express()

const PORT = process.env.PORT || 8000


const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include necessary methods
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())


app.use("/api/auth", userRoutes)


app.use(errorHandler)


app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running at PORT:${PORT}`)
})