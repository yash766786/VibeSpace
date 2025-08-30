const corsOptions = {
    origin: [
        process.env.ORIGIN
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
};

export { corsOptions };
