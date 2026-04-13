const corsOptions = {
    origin: [
         "http://localhost:5173/",
        process.env.ORIGIN
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
};

export { corsOptions };
