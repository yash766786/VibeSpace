
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None", // 🔥 Required for cross-origin cookies
    domain: ".onrender.com", // 🔥 Enables access across Server1 & Server2
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const cookieOptionsForResetPassword = {
    httpOnly: true,
    secure: true,
    sameSite: "None", // 🔥 Required for cross-origin cookies
    domain: ".onrender.com", // 🔥 Enables access across Server1 & Server2
    maxAge: 10 * 60 * 60, // 10 min
};

const deleteCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None", // 🔥 Required for cross-origin cookies
    domain: ".onrender.com", // 🔥 Enables access across Server1 & Server2
    expires: 0,
};

export { cookieOptions, deleteCookieOptions, cookieOptionsForResetPassword}