
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { setCurrentUser } from "../redux/reducer/authSlice";
import { registerUser } from "../api/user.api";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const credentials = {
    fullname: "",
    username: "",
    email: "",
    password: "",
  };
  const [user, setUser] = useState(credentials);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(user).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if(avatar) formData.append("avatar", avatar);

    const toastId = toast.loading("Signing up...");
    setIsLoading(true);
    try {
      const { data } = await registerUser(formData);

      if (data.success) {
        dispatch(setCurrentUser(data.data));
        navigate("/verify", { state: { email: user.email } });
        toast.dismiss(toastId);
        toast.success("Verification OTP sent to email");
      } else {
        toast.error(data.message || "Signup failed", { id: toastId });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", {
        id: toastId, duration:3000
      });
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  };

  const fadeVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8"
      >
        <h2 className="text-center text-3xl font-bold text-primary mb-6">
          Create Your Account
        </h2>

        {/* Avatar Upload */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative w-24 h-24 mx-auto mb-6 group"
        >
          <img
            src={preview || "/default-avatar.png"}
            alt="Avatar Preview"
            className="w-24 h-24 rounded-full object-cover border-2 border-primary group-hover:opacity-80 transition"
          />
          <label
            htmlFor="avatarInput"
            className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer border-2 border-white hover:scale-105 transition"
            title="Upload Avatar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5L9 17.25m0 0h6.75M9 17.25V10.5m0 0L15.75 3.75"
              />
            </svg>
          </label>
          <input
            type="file"
            accept="image/*"
            id="avatarInput"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </motion.div>

        <form onSubmit={handleSignup}>
          {["fullname", "username", "email", "password"].map((field, i) => (
            <motion.div
              key={field}
              className="form-control mb-4"
              initial="hidden"
              animate="visible"
              custom={i + 1}
              variants={fadeVariants}
            >
              <label htmlFor={field} className="label">
                <span className="label-text text-base text-black/80 capitalize">
                  {field === "email" ? "Email address" : field}
                  <span className="text-red-600">*</span>
                </span>
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                id={field}
                placeholder={`Enter ${field}`}
                className="input input-bordered w-full"
                value={user[field]}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, [field]: e.target.value }))
                }
                required
                minLength={field === "password" ? 5 : undefined}
              />
            </motion.div>
          ))}

          <motion.div
            className="form-control mt-6"
            initial="hidden"
            animate="visible"
            custom={5}
            variants={fadeVariants}
          >
            <button
              type="submit"
              className="btn btn-primary w-full text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                "Sign Up"
              )}
            </button>
          </motion.div>
        </form>

        <motion.p
          className="mt-4 text-center text-base text-black"
          initial="hidden"
          animate="visible"
          custom={6}
          variants={fadeVariants}
        >
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Signup;
