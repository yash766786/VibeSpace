const registerTemplate = ({ fullname, data }) => ({
    subject: "Your OTP Code for Email Verification",
    title: "Verify Your Email",

    message: `
        <p>Hello <strong>${fullname}</strong>,</p>

        <p>
            Thank you for registering with VibeSpace!
            Please use the OTP code below to verify your email address:
        </p>

        <div class="otp-code">
            ${data.verificationToken}
        </div>

        <p>
            This code is valid for <strong>10 minutes</strong>.
            If you didn't request this verification, please ignore this email.
        </p>
    `
});

export { registerTemplate };