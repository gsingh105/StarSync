import { ForbiddenError, UnauthorizedError } from "../utils/errorHanlder.js"

export const adminMiddleware = (req, res, next) => {
    try {
        if (!req.user) throw new UnauthorizedError("Uauthorized user")
        if (req.user.role !== "admin") throw new ForbiddenError()

        next()
    } catch (error) {
        next(error)
    }
}
