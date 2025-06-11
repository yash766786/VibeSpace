const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://localhost:5179",
        process.env.CORS_ORIGIN,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

export { corsOptions };
