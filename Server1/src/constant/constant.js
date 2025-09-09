
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None", // 🔥 Required for cross-origin cookies
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const cookieOptionsForResetPassword = {
    httpOnly: true,
    secure: true,
    sameSite: "None", // 🔥 Required for cross-origin cookies
    maxAge: 10 * 60 * 60, // 10 min
};

const deleteCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None", // 🔥 Required for cross-origin cookies
    expires: 0,
};

const DEFAULT_AVATAR = {
    public_id: "default-avatar_i9k939",
    url: "https://res.cloudinary.com/dsg4wtqal/image/upload/v1757251198/default-avatar_i9k939.png"
};

const DEMO_USER_ID = "68bfb7af6604f1eae71cc5ea";


export { 
    cookieOptions, 
    deleteCookieOptions, 
    cookieOptionsForResetPassword, 
    DEFAULT_AVATAR, 
    DEMO_USER_ID 
}
