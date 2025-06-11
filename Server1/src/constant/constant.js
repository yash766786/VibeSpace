// Step 12: Set cookies
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None", // For cross-site cookies
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const deleteCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None", // For cross-site cookies
    expires: 0,
};

export { cookieOptions, deleteCookieOptions}