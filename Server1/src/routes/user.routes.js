import { Router } from "express";
import { 
    registerUser, 
    verifyEmail,
    loginUser, 
    logoutUser, 
    getCurrentUser, 
    updateAccountDetails,
    updateUserAvatar,
    changeCurrentPassword,
    searchUsersByUsername,
    getUserProfile,
    initiateForgotPasswordReset,
    verifyCodeAndResetPassword,
    resendVerificationCode,
} from "../controllers/user.controller.js";
import { verifyToken, VerifyResetToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/register").post(upload.single("avatar"), registerUser)
router.route("/login").post(loginUser)

router.route('/health').get((req,res)=>{
    res.status(200).json({
        success:true,
        message:"Success"
    })
})


// secured routes
router.route('/verify-email').put(verifyToken, verifyEmail);
router.route('/resend-verifycode').get(verifyToken, resendVerificationCode);
router.route("/logout").get(verifyToken, logoutUser)
router.route("/current-user").get(verifyToken, getCurrentUser)
router.route("/edit-profile").patch(verifyToken, updateAccountDetails)
router.route("/change-avatar").patch(verifyToken, upload.single("avatar"), updateUserAvatar)
router.route("/change-password").patch(verifyToken, changeCurrentPassword)

// for all user
router.route("/search-user").get(verifyToken, searchUsersByUsername);
router.route("/profile/:username").get(verifyToken, getUserProfile)

// forgot password
router.route("/forgot-password-reset").post(initiateForgotPasswordReset)
router.route("/reset-password").post(VerifyResetToken, verifyCodeAndResetPassword)

export default router