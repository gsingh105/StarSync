import dotenv from "dotenv";
dotenv.config();
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors" // 1. Import CORS
import connectDB from "./src/config/db.config.js"
import { errorHandler } from "./src/utils/errorHandler.js"
import userRoutes from "./src/routes/auth.routes.js"

const app = express()

const PORT = process.env.PORT || 8000

// 2. CORS Configuration Middleware
// We set up cors to allow requests from the Vite development port (typically 5173) 
// and enable credentials for cookie handling (required because you use cookie-parser).
const corsOptions = {
    // Replace with your actual frontend URL(s)
    origin: 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include necessary methods
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// Define a simple test route before the error handler
app.get('/', (req, res) => {
    res.send('StarSync Backend is running!');
});

app.use("/api/auth", userRoutes)

// 3. Error handler is usually the very last middleware
app.use(errorHandler)


app.listen(PORT, async () => {
    await connectDB();
    // Fixes the template literal syntax error:
    console.log(`Server running at PORT:${PORT}`) 
})