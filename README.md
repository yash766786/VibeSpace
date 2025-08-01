# VibeSpace 🌐

**VibeSpace** is a modern full-stack social media web app built with the MERN stack. It delivers a real-time, interactive user experience through a two-server architecture — one for REST APIs and another for WebSocket-based communication.

## 🧠 Architecture Overview

This monorepo contains three main parts:

    /Client → React frontend  
    /Server1 → REST API server (Authentication, Posts, Likes, Follow, etc.)  
    /Server2 → WebSocket server (Real-time Chat, Notifications)


---

## 🚀 Features

### 🟦 Server 1: REST API (Main Server)

- ✅ User Authentication (Register, Login, Logout)
- 📧 Email Verification
- 📝 Create, Read, Update, Delete Posts
- 💬 Comments & Likes
- 👥 Follow / Unfollow Users
- 🔐 JWT-based Authentication
- ☁️ Cloudinary Media Uploads

### 🟨 Server 2: WebSocket Server (Real-time)

- 💬 1-on-1 Real-time Chat
- 📎 Media Attachments in Chat
- 📥 Chat Invitations (Friend Requests)
- 🔔 Real-time Notifications
- ✅ Seen/Unseen Message Sync

---

## 🧰 Tech Stack

- **Frontend**: React.js, Redux Toolkit, Tailwind CSS
- **Backend (REST)**: Node.js, Express, MongoDB, Mongoose
- **Backend (Socket)**: Node.js, Socket.IO
- **Media**: Cloudinary
- **Authentication**: JWT, Nodemailer (Email)
- **Dev Tools**: ESLint, Prettier, dotenv

---

## 📂 Project Structure
    /VibeSpace  
    ├── /Client  
    ├── /Server1 → REST API (port 5000)  
    ├── /Server2 → WebSocket Server (port 6000)  
    └── README.md


---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yash766786/VibeSpace.git
cd VibeSpace

```

### 2. Setup Client
```
cd Client
npm install
npm run dev
```

### 3. Setup Server1 (REST API)
```
cd ../Server1
npm install
npm run dev
```

### 4. Setup Server2 (WebSocket Server)
```
cd ../Server2
npm install
npm run dev
```
Make sure to set up .env files in each folder as needed.

