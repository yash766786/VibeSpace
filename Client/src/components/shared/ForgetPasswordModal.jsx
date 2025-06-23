// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { sendOtpToEmail } from "../api/user.api"; // <-- Your actual API
// import { motion } from "framer-motion";

// const ForgotPasswordModal = ({onClick}) => {
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const toastId = toast.loading("Sending OTP...");

//     try {
//       const res = await sendOtpToEmail(email);
//       toast.success(res.data.message || "OTP sent!", { id: toastId });
//       document.getElementById("forgot-password-modal").checked = false;
//       navigate("/password-reset", { state: { email } });
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Something went wrong", {
//         id: toastId,
//       });
//     } finally {
//       toast.dismiss(toastId);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <input type="checkbox" id="forgot-password-modal" className="modal-toggle" />
//       <div className="modal">
//         <div className="modal-box rounded-2xl">
//           <motion.h3
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className="font-bold text-lg text-primary mb-4"
//           >
//             Forgot Password
//           </motion.h3>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="email"
//               placeholder="Enter your registered email"
//               className="input input-bordered w-full"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//             <div className="modal-action">
//               <motion.button
//                 type="submit"
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="btn btn-primary"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <span className="loading loading-spinner loading-sm"></span>
//                 ) : (
//                   "Send OTP"
//                 )}
//               </motion.button>
//               <label htmlFor="forgot-password-modal" className="btn btn-outline">
//                 Cancel
//               </label>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ForgotPasswordModal;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// import { sendOtpToEmail } from "../api/user.api";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X } from "lucide-react";
import { initiateForgotPasswordReset } from "../../api/user.api";

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Sending OTP...");

    try {
      const res = await initiateForgotPasswordReset({email});
      toast.success(res.data.message || "OTP sent!", { id: toastId });
      onClose(); // close modal
      navigate("/password-reset", { state: { email } });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Modal Box */}
        <div className="bg-white w-full max-w-md rounded-xl shadow-lg relative z-60 p-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <div className="flex items-center gap-2 text-primary font-semibold text-lg">
              <Mail className="w-5 h-5" />
              <span>Forgot Password</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-red-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              placeholder="Enter your registered email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input input-bordered w-full"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Send OTP"
              )}
            </motion.button>
          </form>
        </div>

        {/* Blurred background overlay */}
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={onClose}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;
