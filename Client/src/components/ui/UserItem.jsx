import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const UserItem = ({ user, onClose }) => {
  const navigate = useNavigate();
  const handleProfileNavigation = (username) => {
    navigate(`/${username}`);
    onClose()
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}              // Start 20px below
      animate={{ opacity: 1, y: 0 }}               // Animate to neutral
      exit={{ opacity: 0, y: 10 }}                 // Exit slightly downward
      transition={{ duration: 0.4, ease: "easeOut" }} // Smoother easing
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer"
      onClick={() => handleProfileNavigation(user.username)}
    >
      <img
        src={user.avatar.url}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover border"
      />
      <div>
        <p className="font-medium text-black">{user.username}</p>
        <p className="text-sm text-gray-500">{user.fullname}</p>
      </div>
    </motion.div>
  );
};

export default UserItem;