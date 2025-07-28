const corsOptions = {
    origin: [
        process.env.CORS_ORIGIN,
        "https://vibespace-gilt.vercel.app",
        // "http://localhost:5174",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
};

export { corsOptions };
