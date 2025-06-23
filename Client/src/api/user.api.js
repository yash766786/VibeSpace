import { server1Form, server1Json } from "./server/server1Axios";

// server1
export const registerUser = (formData) => server1Form.post('/users/register', formData);
export const verifyEmail = (formData) => server1Json.put('/users/verify-email', formData);
export const resendVerificationCode = () => server1Json.get('/users/resend-verifycode');

export const loginUser = (formData) => server1Json.post('/users/login', formData);
export const logoutUser = () => server1Json.get('/users/logout');
export const getCurrentUser = () => server1Json.get('/users/current-user');

export const updateAccountDetails = (formData) => server1Json.patch('/users/edit-profile', formData);
export const updateUserAvatar = (formData) => server1Form.patch('/users/change-avatar', formData);
export const changeCurrentPassword = (formData) => server1Json.patch('/users/change-password', formData);

export const searchUsersByUsername = (username) => server1Json.get(`/users/search-user?username=${username}`);
export const getUserProfile = (username) => server1Json.get(`/users/profile/${username}`);

export const initiateForgotPasswordReset = (jsonData) => server1Json.post("/users/forgot-password-reset", jsonData)
export const verifyCodeAndResetPassword = (jsonData) => server1Json.post("/users/reset-password", jsonData)
