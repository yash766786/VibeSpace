import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { setCurrentUser } from "../redux/reducer/authSlice";
import { getTokenFromServer2, loginUser } from "../api/user.api";
import ForgotPasswordModal from "../components/shared/ForgetPasswordModal";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const credentials = {
    email: "",
    password: "",
  };
  const [user, setUser] = useState(credentials);
  const [showForgetPasswordModal, setShowForgetPasswordModal] = useState(false);

  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   setIsLoading(true);
  //   const toastId = toast.loading("Logging In...");
  //   try {
  //     const { data } = await loginUser(user);
  //     console.log(data);
  //     if (!data.success) {
  //       toast.error(`${data.message}`, { id: toastId });
  //     } else {
  //       dispatch(setCurrentUser(data.data));
  //       if (!data.data.isVerified) {
  //         navigate("/verify");
  //         toast.dismiss(toastId);
  //         toast.success("Please verify your email First");
  //       } else {
  //         navigate("/");
  //         toast.dismiss(toastId);
  //         toast.success(`Welcome back! ${data.data.fullname}`);
  //       }
  //     }
  //   } catch (err) {
  //     toast.error(err?.response?.data?.message || "Something went wrong", {
  //       id: toastId,
  //       duration: 3000,
  //     });
  //   } finally {
  //     toast.dismiss(toastId);
  //     setIsLoading(false);
  //     setUser(credentials);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const toastId = toast.loading("Logging In...");

    try {
      // Step 1: Login to Server 1
      const { data } = await loginUser(user);
      if (!data.success) {
        toast.error(`${data.message}`, { id: toastId });
        return;
      }

      const userData = data.data;
      console.log(userData)

      // Step 2: Login to Server 2 (important for REST API cookies)
      try {
        const rest = await getTokenFromServer2({ user: userData });
        console.log("Server 2 login successful", rest);
      } catch (err) {
        console.error("Failed to login to Server 2", err);
        toast.error("Login failed: Server 2 not responding", {
          id: toastId,
          duration: 3000,
        });
        return; // optionally exit early if both cookies are required
      }

      dispatch(setCurrentUser(userData));
      console.log("Setting user");
      
      // Step 3: Navigation based on verification
      if (!userData.isVerified) {
        navigate("/verify");
        toast.success("Please verify your email first", { id: toastId });
        console.log("running1..")
      } else {
        navigate("/");
        toast.success(`Welcome back! ${userData.fullname}`, { id: toastId });
        console.log("running2..")
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", {
        id: toastId,
        duration: 3000,
      });
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
      setUser(credentials); // reset form
    }
  };

  const handleShowForgetPasswordModal = () => {
    setShowForgetPasswordModal(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8"
      >
        {/* Modal Component */}
        {showForgetPasswordModal && (
          <ForgotPasswordModal
            onClose={() => setShowForgetPasswordModal(false)}
          />
        )}

        <h2 className="text-center text-3xl font-bold text-primary mb-6">
          Sign In to Your Account
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="form-control"
          >
            <label htmlFor="email" className="label">
              <span className="label-text text-base text-black/80">
                Email address<span className="text-red-600">*</span>
              </span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              placeholder="Enter email"
              className="input input-bordered w-full"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="form-control"
          >
            <label htmlFor="password" className="label text-black/80">
              <span className="label-text">
                Password<span className="text-red-600">*</span>
              </span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              placeholder="Enter password"
              className="input input-bordered w-full"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              minLength={5}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="form-control mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full text-base"
            >
              {isLoading ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <button
            className="text-sm font-medium text-primary hover:underline cursor-pointer"
            onClick={handleShowForgetPasswordModal} // ✅ fixed
          >
            Forgot Password?
          </button>
        </div>

        {/* Signup Redirect */}
        <p className="mt-4 text-center text-base text-black">
          Don&apos;t have an account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
