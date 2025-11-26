export const successResponse = (res, message = "Success", data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data

    })

}

export const errorResponse = (res, message = "Something went wrong", statusCode = 500) => {
    return res.status(statusCode).json({
        suceess: false,
        message,

    })
}