// components/shared/ModalWrapper.jsx
import { motion } from "framer-motion";

const ModalWrapper = ({ children, onClose }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg p-4 max-h-[80vh] overflow-y-auto w-full max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </div>
);

export default ModalWrapper;
