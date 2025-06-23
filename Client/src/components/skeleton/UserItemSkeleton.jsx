import { motion } from "framer-motion";

const UserItemSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center gap-3 p-3 rounded-lg animate-pulse"
    >
      <div className="w-10 h-10 rounded-full bg-gray-300" />
      <div className="flex flex-col gap-2 w-full">
        <div className="w-32 h-4 bg-gray-300 rounded" />
        <div className="w-24 h-3 bg-gray-200 rounded" />
      </div>
    </motion.div>
  );
};

export default UserItemSkeleton;
