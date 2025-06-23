import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  UserCheck,
  MessagesSquare,
  LayoutDashboard,
  Github,
  Linkedin,
  Flame,
  Rocket,
} from "lucide-react";

const features = [
  {
    icon: <UserCheck className="text-primary w-6 h-6" />,
    title: "Authentication & Verification",
    desc: "Secure sign-up, login, email verification with avatar preview and route guards.",
  },
  {
    icon: <LayoutDashboard className="text-primary w-6 h-6" />,
    title: "Profile & Social Features",
    desc: "Follow/unfollow, dynamic profile pages, modals for followers/following, post count and more.",
  },
  {
    icon: <MessagesSquare className="text-primary w-6 h-6" />,
    title: "Real-time Chat",
    desc: "1:1 real-time messaging with reverse scroll, online status, and chat invitations.",
  },
  {
    icon: <Rocket className="text-primary w-6 h-6" />,
    title: "Sleek UI/UX",
    desc: "Responsive layout with Framer Motion animations, Tailwind design, and beautiful modals.",
  },
];

const About = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex justify-center items-center gap-2">
          <Flame className="text-red-500 w-8 h-8" />
          About VibeSpace
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          A full-stack social media platform built for real-time interaction, creativity, and seamless user experience.
        </p>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-8"
      >
        {features.map((f, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="p-5 bg-white shadow-md rounded-xl border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-2">
              {f.icon}
              <h3 className="text-lg font-semibold text-gray-800">{f.title}</h3>
            </div>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Developer Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="bg-gray-100 p-6 rounded-xl shadow-inner space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
          <CheckCircle className="text-green-600" />
          Behind the Code
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Hi! I'm <span className="font-semibold text-gray-900">Yash Kr Choudhary</span>, the developer of VibeSpace.
          This project is the result of my 50-day summer learning sprint where I challenged myself to build something full-stack, modern, and real-time.
          From building dual-server architecture (REST + WebSocket), integrating Cloudinary & Email OTP, to perfecting UI animations — I handled everything solo.
        </p>
        <p className="text-gray-700">
          VibeSpace taught me real-world product thinking, clean UI design, and complete MERN stack mastery.
        </p>
      </motion.div>

      {/* Links Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center gap-6"
      >
        <a
          href="https://github.com/yash766786"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-200 transition"
        >
          <Github />
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/yash-kr-choudhary-4823752a7/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-blue-100 transition"
        >
          <Linkedin />
          LinkedIn
        </a>
      </motion.div>
    </div>
  );
};

export default About;
