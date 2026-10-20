const passwordResetTemplate = ({ fullname, data }) => ({
    subject: "Password Reset OTP",
    title: "Reset Your Password",

    message: `
        <p>Hello <strong>${fullname}</strong>,</p>

        <p>
            You requested to reset your VibeSpace password.
            Please use the OTP code below to reset your password:
        </p>

        <div class="otp-code">
            ${data.resetToken}
        </div>

        <p>
            This code is valid for <strong>20 minutes</strong>.
            If you didn't request this action, please ignore this email.
        </p>
    `
});

export { passwordResetTemplate };