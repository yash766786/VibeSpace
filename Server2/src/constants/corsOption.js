const corsOptions = {
    origin: [
        // "http://localhost:5174",
        process.env.CORS_ORIGIN,
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
};

export { corsOptions };
