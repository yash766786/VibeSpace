// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { conf, configWithHeaders } from "../conf/conf";
// import toast from "react-hot-toast";
// import { useNavigate, Link } from "react-router-dom";
// import { setCurrentUser } from "../redux/reducer/authSlice";
// import axios from "axios";
// import { Toaster } from "react-hot-toast";
// import { loginUser } from "../api/user.api";

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [isLoading, setIsLoading] = useState(false);
//   const credentials = {
//     email: "",
//     password: "",
//   };
//   const [user, setUser] = useState(credentials);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     setIsLoading(true);
//     const toastId = toast.loading("Logging In...");
//     try {
//       const { data } = await loginUser(user);
//       if (!data.success) {
//         toast.error(`${data.message}`, { id: toastId });
//       } else {
//         dispatch(setCurrentUser(data.data));
//         if (!data.data.isVerified) {
//           navigate("/verify");
//           toast.dismiss(toastId);
//           toast.success("Please verify your email First");
//         } else {
//           navigate("/");
//           toast.dismiss(toastId);
//           toast.success(`Welcome back! ${data.data.fullname}`);
//         }
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Something went wrong", {
//         id: toastId,
//       });
//     } finally {
//       toast.dismiss(toastId);
//       setIsLoading(false);
//       setUser(credentials);
//     }
//   };

//   return (
//     <div className="h-full  flex items-center justify-center m-20">
//       <Toaster />
//       <div className="card w-full max-w-lg rounded-2xl shadow-2xl bg-base-300">
//         <div className="card-body">
//           <h2 className="text-center text-2xl font-bold leading-tight text-primary">
//             Sign In to your Account
//           </h2>

//           <form onSubmit={handleLogin}>
//             {/* email Field */}
//             <div className="form-control mb-4">
//               <label htmlFor="email" className="label">
//                 <span className="label-text text-base text-black/80">
//                   Email address<span className="text-red-600">*</span>
//                 </span>
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={user.email}
//                 placeholder="Enter email"
//                 className="input input-bordered w-full"
//                 onChange={(e) => setUser({ ...user, email: e.target.value })}
//                 required
//               />
//             </div>

//             {/* Password Field */}
//             <div className="form-control mb-4">
//               <label htmlFor="password" className="label text-black/80">
//                 <span className="label-text">
//                   Password<span className="text-red-600">*</span>
//                 </span>
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={user.password}
//                 placeholder="Enter password"
//                 className="input input-bordered w-full"
//                 onChange={(e) => setUser({ ...user, password: e.target.value })}
//                 required
//                 minLength={5}
//               />
//             </div>

//             {/* Submit Button */}
//             <div className="form-control mt-6">
//               {isLoading ? (
//                 <button
//                   type="submit"
//                   className="btn btn-primary w-full text-base"
//                   disabled
//                 >
//                   <span className="loading loading-dots loading-md"></span>
//                 </button>
//               ) : (
//                 <button
//                   type="submit"
//                   className="btn btn-primary w-full text-base"
//                 >
//                   Sign Up
//                 </button>
//               )}
//             </div>
//           </form>

//           {/* Forgot Password Link */}
//           <div className="mt-4 text-center">
//             <button
//               // onClick={handleForgetPassword}
//               className="text-sm font-medium text-primary transition-all duration-200 hover:underline"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           <p className="mt-2 text-center text-base text-black">
//             Don&apos;t have any account?&nbsp;
//             <Link
//               to="/signup"
//               className="font-medium text-primary transition-all duration-200 hover:underline"
//             >
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { setCurrentUser } from "../redux/reducer/authSlice";
import { loginUser } from "../api/user.api";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const credentials = {
    email: "",
    password: "",
  };
  const [user, setUser] = useState(credentials);

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const toastId = toast.loading("Logging In...");
    try {
      const { data } = await loginUser(user);
      if (!data.success) {
        toast.error(`${data.message}`, { id: toastId });
      } else {
        dispatch(setCurrentUser(data.data));
        if (!data.data.isVerified) {
          navigate("/verify");
          toast.dismiss(toastId);
          toast.success("Please verify your email First");
        } else {
          navigate("/");
          toast.dismiss(toastId);
          toast.success(`Welcome back! ${data.data.fullname}`);
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
      setUser(credentials);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8"
      >
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
          <button className="text-sm font-medium text-primary hover:underline">
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


// form
// header -> login
// input fields -> email, password
// submit button
// dont have account? -> signup
// forgot password? -> redirect to password reset page

// on submit -> send a post request to the server with email and password
// if success===false -> show error message
// if success===true -> two cases
// 1. if user is not verified -> redirect to verify page
// 2. if user is verified -> redirect to home page
