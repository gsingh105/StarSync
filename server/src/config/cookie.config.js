const isProduction = process.env.NODE_ENV === "production"

export const cookieOptionsForAcessToken = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 180 * 60 * 1000,
    path: "/",
}

export const cookieOptionsForRefreshToken = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
}