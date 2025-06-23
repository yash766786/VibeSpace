import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
};

const LandingPage = () => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="max-w-5xl w-full text-center bg-white p-10 rounded-2xl shadow-2xl"
        variants={itemVariants}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-primary mb-6"
          variants={itemVariants}
        >
          Welcome to <span className="text-secondary">VibeSpace</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-700 mb-10"
          variants={itemVariants}
        >
          Connect, Share, and Vibe with people around the globe. Join the new
          social experience built for the modern world.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-6"
          variants={itemVariants}
        >
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary text-lg px-8"
            >
              Get Started
            </motion.button>
          </Link>

          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-outline btn-secondary text-lg px-8"
            >
              Sign In
            </motion.button>
          </Link>
        </motion.div>

        {/* ✅ About Link */}
        <motion.div
          className="mt-6 text-sm text-gray-600 hover:text-primary transition flex justify-center items-center gap-1"
          variants={itemVariants}
        >
          <Info className="w-4 h-4 inline-block" />
          <Link to="/about" className="underline underline-offset-2">
            Learn more about VibeSpace
          </Link>
        </motion.div>

        <motion.img
          src="https://illustrations.popsy.co/gray/web-design.svg"
          alt="Hero"
          className="mx-auto mt-12 max-w-sm sm:max-w-md lg:max-w-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;
