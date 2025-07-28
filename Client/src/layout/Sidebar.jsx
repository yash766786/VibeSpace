import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { clearTokenFromServer2, logoutUser } from "../api/user.api.js";
// import vibespaceLogo from "../assets/vibespace.svg"; // adjust path
import {
  Home,
  MessageSquare,
  FilePlus,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowWidth } from "../hooks/useWindowWidth ";
import { Info } from "lucide-react";
import { setCurrentUser } from "../redux/reducer/authSlice.js";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const width = useWindowWidth();
  const isDesktop = width >= 768;

  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await Promise.all([logoutUser(), clearTokenFromServer2()]);
      dispatch(setCurrentUser(null)); // Clear Redux
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  return (
    <>
      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || isDesktop) && (
          <motion.div
            key="sidebar"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            transition={{ type: "tween", duration: 0.3 }}
            className={`
              fixed md:sticky md:top-0 inset-y-0 left-0 z-20 w-64 
              md:bg-inherit bg-white p-4 
              md:translate-x-0 md:border-r border-gray-200
              shadow-lg md:shadow-none
            `}
          >
            {/* Logo */}
            <div className="flex justify-between items-center mb-6 md:hidden">
              <div className="flex items-center gap-2">
                <img src="/VibeSpace.svg" alt="Logo" className="w-7 h-7" />
                <span className="text-xl font-semibold">VibeSpace</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="ml-auto text-gray-500 hover:text-red-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="space-y-2">
              <SidebarLink to="/" icon={<Home />} label="Home" />
              <SidebarLink to="/chat" icon={<MessageSquare />} label="Chats" />
              <SidebarLink to="/post" icon={<FilePlus />} label="Post" />
              <SidebarLink
                to={`/${currentUser?.username}`}
                icon={<User />}
                label="Profile"
              />
              <SidebarLink to="/setting" icon={<Settings />} label="Setting" />
              <SidebarLink to="/about" icon={<Info />} label="About" />
              <button
                onClick={handleLogout}
                className="btn btn-ghost justify-start w-full gap-2 hover:bg-red-100 hover:text-red-600 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>

            {/* Footer */}
            <div className="text-xs text-center absolute bottom-3 left-0 w-full text-gray-500 opacity-70 hover:opacity-100 transition-opacity">
              <p>&copy; {new Date().getFullYear()} VibeSpace</p>
              <p>Made with ❤️ by Yash</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay on Mobile */}
      {(isSidebarOpen || isDesktop) && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="btn btn-ghost justify-start w-full gap-2 text-base hover:bg-primary/10 hover:text-primary transition-all"
  >
    {icon}
    {label}
  </Link>
);

export default Sidebar;
