const corsOptions = {
    origin: [
        process.env.ORIGIN1,
        process.env.ORIGIN2,
        process.env.CORS_ORIGIN,
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
};

export { corsOptions };
