const welcomeTemplate = ({ fullname }) => ({
    subject: "Welcome to VibeSpace!",
    title: "Welcome to VibeSpace!",

    message: `
        <p>
            Hey <strong>${fullname}</strong>,
        </p>

        <p>
            🎉 Your email has been successfully verified
            and your VibeSpace account is now active!
        </p>

        <p>
            We're thrilled to have you here.
            Explore the platform, connect with people,
            and enjoy the experience!
        </p>

        <p>
            If you ever need help, our support team is always here for you.
        </p>

        <br />

        <p>
            Cheers,<br />
            <strong>The VibeSpace Team</strong>
        </p>
    `
});

export { welcomeTemplate };