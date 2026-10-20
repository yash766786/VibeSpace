import { transporter } from "../mail/email.config.js";
import { getEmailTemplate } from "../mail/email.registry.js";


const sendEmail = async (emailEvent) => {

    const {
        email,
        fullname,
        emailType,
        data
    } = emailEvent;

    // Get template based on email type
    const template = getEmailTemplate(emailType);

    // Generate email content
    const { subject, title, message } = template({
        fullname,
        data
    });

    // Send email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html: generateEmailLayout({
            title,
            message
        })
    });
};


const generateEmailLayout = ({ title, message }) => {

    return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <title>${title}</title>

            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, Helvetica, sans-serif;
                    background-color: #f4f4f4;
                    line-height: 1.6;
                    color: #333333;
                }

                .email-container {
                    background-color: #ffffff;
                    max-width: 600px;
                    margin: 30px auto;
                    border: 1px solid #dddddd;
                    border-radius: 8px;
                    overflow: hidden;
                }

                .header {
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 18px;
                    text-align: center;
                    font-size: 26px;
                    font-weight: bold;
                }

                .content {
                    padding: 30px 25px;
                    text-align: center;
                }

                .content p {
                    margin: 12px 0;
                }

                .otp-code {
                    display: inline-block;
                    background-color: #f8f9fa;
                    border: 1px solid #007bff;
                    color: #007bff;
                    font-size: 28px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    padding: 12px 22px;
                    margin: 20px auto;
                    border-radius: 6px;
                }

                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #666666;
                    padding: 15px 20px;
                    background-color: #f4f4f4;
                    border-top: 1px solid #dddddd;
                }

                .footer a {
                    color: #007bff;
                    text-decoration: none;
                }
            </style>
        </head>

        <body>

            <div class="email-container">

                <div class="header">
                    VibeSpace
                </div>

                <div class="content">
                    ${message}
                </div>

                <div class="footer">
                    <p>
                        &copy; ${new Date().getFullYear()} VibeSpace.
                        All rights reserved.
                    </p>

                    <p>
                        Need help?
                        <a href="mailto:support@vibespace.com">
                            Contact Support
                        </a>
                    </p>
                </div>

            </div>

        </body>

        </html>
    `;
};


export { sendEmail };