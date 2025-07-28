
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None", // 🔥 Required for cross-origin cookies
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const deleteCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None", // 🔥 Required for cross-origin cookies
    expires: 0,
};

export { cookieOptions, deleteCookieOptions }
