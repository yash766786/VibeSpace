// helper/mailer.js
import  nodemailer  from "nodemailer";
import { generateMailBody } from "./mailBody.js";
import { ApiError } from "../utils/ApiError.js";
import { tr } from "@faker-js/faker";

const transporter = nodemailer.createTransport({
    service: 'gmail', // Change this to 'gmail' if you're using Gmail             // Use `true` for port 465, `false` for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSKEY, // Your email password or app-specific password
  },
});

const sendVerificationEmail = async (user, verificationToken, type, subject) => {
    const htmlContent = generateMailBody(user, verificationToken, type);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: subject,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions); 
        return true;
    } catch (error) {
        return false;
    }
};

export { sendVerificationEmail }