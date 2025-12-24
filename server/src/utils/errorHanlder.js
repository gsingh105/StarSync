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
        super(message, 500)
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


/**
 export class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden - Access Denied") {
        super(message, 403);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict occurs") {
        super(message, 409);
    }
}

export class RateLimitError extends AppError {
    constructor(message = "Too many requests, please try again later") {
        super(message, 429);
    }
}

export class ServerError extends AppError {
    constructor(message = "Internal server error") {
        super(message, 500, false); // isOperational = false because it's a bug
    }
}

/**
export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // 1. Handle Mongoose Validation Errors (e.g., missing required fields)
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(e => e.message).join(', ');
        err = new AppError(`Validation failed: ${message}`, 400);
    }

    // 2. Handle Mongoose Duplicate Key Errors (e.g., email already exists)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        err = new AppError(`Duplicate field value: ${field}. Please use another value!`, 409);
    }

    // 3. Handle Invalid MongoDB ObjectIDs (CastError)
    if (err.name === 'CastError') {
        err = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
    }

    // 4. Handle JWT Errors
    if (err.name === 'JsonWebTokenError') {
        err = new UnauthorizedError("Invalid token. Please log in again.");
    }
    if (err.name === 'TokenExpiredError') {
        err = new UnauthorizedError("Your session has expired. Please log in again.");
    }

    // 5. Response logic based on Environment
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        });
    } else {
        // Production Mode: Don't leak stack traces
        if (err.isOperational) {
            // Trusted error: send clear message to client
            res.status(err.statusCode).json({
                success: false,
                message: err.message
            });
        } else {
            // Programming or unknown error: send generic message
            console.error('ERROR 💥:', err);
            res.status(500).json({
                success: false,
                message: "Something went wrong on our end"
            });
        }
    }
};
*/

/**
 * catchAsync wraps an asynchronous function and catches any errors 
 * that occur during its execution, passing them to the next() 
 * middleware (your global error handler).
 
export const catchAsync = (fn) => {
    return (req, res, next) => {
        // fn(req, res, next) returns a promise. 
        // .catch(next) is shorthand for .catch(err => next(err))
        fn(req, res, next).catch(next);
    };
};
*/