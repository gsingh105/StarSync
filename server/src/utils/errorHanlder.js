export class AppError extends Error {
    constructor(message, statusCode = 500, isOpeartional = true) {
        super(message)
        this.statusCode = statusCode,
            this.isOpeartional = isOpeartional,
            Error.captureStackTrace(this, this.constructor)

    }
}

export class BadRequestError extends AppError {
    constructor(message = "Bad Request") {
        super(message, 400)
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401)
    }
}
export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404)
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict occurs") {
        super(message, 409)
    }
}
export class SeverError extends AppError {
    constructor(message = "Internal server error") {
        supera(message, 500)
    }
}
export class RateLimitError extends AppError {
    constructor(message = "Too many requests, please try again later") {
        super(message, 429)
    }
}

export class ServerError extends AppError {
    constructor(message = "Internal server error") {
        super(message, 500)
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden - Admins only") {
        super(message, 403)
    }
}

export const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }

    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map(e => e.message)
        return res.status(400).json({
            success: false,
            message: "Validarition failed",
            errors
        })
    }

    console.log("Unexpected error:", err)
    res.status(500).json({
        success: false,
        message: "Internal server error"
    })

}