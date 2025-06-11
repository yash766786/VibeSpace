// import toast from "react-hot-toast";
// import { Toaster } from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router";
// import { logoutUser } from "../api/user.api";

// // src/components/layout/Sidebar.jsx
// const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {

//   const { currentUser } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const handleLogout = async (e) => {
//     e.preventDefault();
//     try {
//       const {data} = await logoutUser();
//       if(data.success) navigate("/landing")
//     } catch (error) {
//       toast.error(error?.response?.data?.message)
//     }
//   }

//   return (
//     <>
//       <Toaster />
//       {/* Sidebar Container */}
//       <div
//         className={`
//           fixed md:sticky md:top-0 inset-y-0 left-0 z-20 w-64 bg-base-200 p-4 transform transition-transform duration-300
//           ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           md:translate-x-0
//         `}
//       >
//         {/* Header in sidebar (only mobile) */}
//         <div className="flex justify-between items-center mb-6 md:hidden">
//           <h2 className="text-xl font-bold">VibeSpace</h2>
//           <button onClick={() => setIsSidebarOpen(false)}>X</button>
//         </div>

//         {/* Nav Links - same on all screen sizes */}
//           <nav className="space-y-2">
//             <Link className="btn btn-ghost justify-start w-full" to="/">Home</Link>
//             <Link className="btn btn-ghost justify-start w-full" to="/chat">Chats</Link>
//             <Link className="btn btn-ghost justify-start w-full" to="/post">Post</Link>
//             <Link className="btn btn-ghost justify-start w-full" to={`/${currentUser?.username}`} >Profile</Link>
//             <Link className="btn btn-ghost justify-start w-full" to="/setting">Setting</Link>
//             <button className="btn btn-ghost justify-start w-full" type="button" onClick={handleLogout}>Logout</button>
//             {/* Add more nav links */}
//           </nav>

//       </div>

//     {/* Mobile overlay */}
// {isSidebarOpen && (
//   <div
//     className="fixed inset-0 bg-black/50 z-10 md:hidden"
//     onClick={() => setIsSidebarOpen(false)}
//   />
// )}
//   </>
// );
// };

// export default Sidebar;

import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { logoutUser } from "../api/user.api.js";
import vibespaceLogo from "../assets/vibespace.svg"; // adjust path
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

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const width = useWindowWidth();
  const isDesktop = width >= 768;

  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await logoutUser();
      if (data.success) navigate("/landing");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  // return (
  //   <>
  //     <Toaster />
  //     <div
  //       className={`
  //          fixed md:sticky md:top-0 inset-y-0 left-0 z-20 w-64 md:bg-inherit bg-white p-4 transform transition-transform duration-300
  //          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
  //          md:translate-x-0 md:border-r-1 md:border-r-red-500
  //        `}
  //     >
  //       <div>
  //         {/* Logo */}
  //         <div className="flex justify-between items-center mb-6 md:hidden">
  //           <img src={vibespaceLogo} alt="Logo" className="w-7 h-7" />
  //           <span className="text-xl font-semibold">VibeSpace</span>
  //           <button onClick={() => setIsSidebarOpen(false)} className="ml-auto md:hidden text-sm">
  //             ✕
  //           </button>
  //         </div>

  //         {/* Nav Links */}
  //         <nav className="space-y-2">
  //           <Link className="btn btn-ghost justify-start w-full" to="/">Home</Link>
  //           <Link className="btn btn-ghost justify-start w-full" to="/chat">Chats</Link>
  //           <Link className="btn btn-ghost justify-start w-full" to="/post">Post</Link>
  //           <Link className="btn btn-ghost justify-start w-full" to={`/${currentUser?.username}`}>Profile</Link>
  //           <Link className="btn btn-ghost justify-start w-full" to="/setting">Setting</Link>
  //           <button className="btn btn-ghost justify-start w-full" onClick={handleLogout}>Logout</button>
  //         </nav>
  //       </div>

  //       {/* Footer */}
  //       <div className="text-xs text-center absolute bottom-3 flex items-center justify-center text-gray-500 mt-8 opacity-70 hover:opacity-100 transition-opacity">
  //         <p>&copy; {new Date().getFullYear()} VibeSpace</p>
  //         <p>Made with ❤️ by Yash</p>
  //       </div>
  //     </div>

  //     {/* Overlay on mobile */}
  //     {isSidebarOpen && (
  //       <div
  //         className="fixed inset-0 bg-black/50 z-10 md:hidden"
  //         onClick={() => setIsSidebarOpen(false)}
  //       />
  //     )}
  //   </>
  // );

  return (
    <>
      <Toaster />

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
                <img src={vibespaceLogo} alt="Logo" className="w-7 h-7" />
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
