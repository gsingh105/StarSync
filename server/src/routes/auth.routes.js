import express from "express"
import { registerValidator, loginValidator } from "../validations/auth.validator.js"
import { validate } from "../middlewares/validationResult.js"
import { loginUserController, registerUserController } from "../controllers/auth.controllers.js"

const router = express.Router()

router.post("/register", registerValidator, validate, registerUserController)
router.post("/login", loginValidator, validate, loginUserController)

export default router
