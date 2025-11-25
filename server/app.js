import dotenv from "dotenv"

dotenv.config({
    path: ".env",
    quiet: "true"
})
import express from "express"
import cookieParser from "cookie-parser"
import connectDB from "./src/config/db.config.js"
import { errorHandler } from "./src/utils/errorHanlder.js"
import userRoutes from "./src/routes/auth.routes.js"
const app = express()


const PORT = process.env.PORT || 8000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(errorHandler)


app.use("api/auth", userRoutes)


app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running at PORT:${PORT}`)
})