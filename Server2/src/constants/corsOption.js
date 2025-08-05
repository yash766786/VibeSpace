const corsOptions = {
    origin: [
        process.env.ORIGIN1,
        process.env.ORIGIN2,
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
};

export { corsOptions };
