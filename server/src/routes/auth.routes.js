import express from "express"

import { registerValidator, loginValidator } from "../validations/auth.validator.js"
import { validate } from "../middlewares/validationResult.js"
import { getCurrentUserController, googleLoginController, loginUserController, logoutUserController, registerUserController } from "../controllers/auth.controllers.js"
import { authMiddleware } from "../middlewares/autMiddleware.js"

const router = express.Router()



router.post("/register", registerValidator, validate, registerUserController)
router.post("/login", loginValidator, validate, loginUserController)
router.post("/logout",authMiddleware,logoutUserController)
router.get("/currentUser",authMiddleware,getCurrentUserController)

router.post("/google", googleLoginController)

export default router   