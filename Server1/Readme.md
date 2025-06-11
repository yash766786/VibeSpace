server1-api/
├── src/
│   ├── controllers/     # Route logic
│   ├── routes/          # API route definitions
│   ├── models/          # Mongoose schemas
│   ├── middlewares/     # Auth, validation, error handlers
│   ├── utils/           # Reusable helpers
│   ├── config/          # DB, Cloudinary, env setup
│   ├── services/        # Business logic (e.g., password reset)
│   └── index.js         # App entry point
├── .env
└── package.json


server2-socket/
├── src/
│   ├── socket/          # Socket event handlers
│   ├── controllers/     # Chat, invite, notify logic
│   ├── middlewares/     # JWT auth middleware for socket
│   ├── models/          # (Reuse or import shared models via shared folder)
│   ├── utils/           # Cloudinary upload, message formatting, etc.
│   ├── config/          # Socket server setup, env
│   └── index.js         # Socket.IO server entry
├── .env
└── package.json


client/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Login, Register, Home, Chat, Profile
│   ├── context/         # Auth, socket context
│   ├── services/        # Axios setup, API calls
│   ├── utils/           # Formatters, hooks
│   ├── assets/          # Icons, images
│   ├── App.jsx
│   └── main.jsx
├── public/
├── .env
└── package.json
