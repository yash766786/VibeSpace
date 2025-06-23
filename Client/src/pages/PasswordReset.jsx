import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { verifyCodeAndResetPassword } from "../api/user.api"; // create this API

const PasswordReset = () => {
  const [otp, setotp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  // const email = state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const toastId = toast.loading("Resetting password...");
    try {
      const res = await verifyCodeAndResetPassword({ verifyCode: otp, password: newPassword });
      toast.success(res.data.message || "Password updated!", { id: toastId });
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reset password", {
        id: toastId,
      });
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter otp"
            className="input input-bordered w-full"
            value={otp}
            onChange={(e) => setotp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            className="input input-bordered w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="btn btn-primary w-full"
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default PasswordReset;
