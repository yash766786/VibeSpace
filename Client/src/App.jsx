// app.jsx
import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { setAuthChecked, setCurrentUser } from "./redux/reducer/authSlice.js";

// Lazy-loaded Pages
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Verify = lazy(() => import("./pages/Verify.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Layout = lazy(() => import("./layout/Layout.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const CreatePost = lazy(() => import("./pages/CreatePost.jsx"));
const Setting = lazy(() => import("./pages/Setting.jsx"));
const Chat = lazy(() => import("./pages/Chat.jsx"));
const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));
// const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx")); // new page

// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AuthRoute from "./routes/AuthRoute.jsx";
import EmailVerifyRoute from "./routes/EmailVerifyRoute.jsx";
import { getCurrentUser } from "./api/user.api.js";

const App = () => {
  const dispatch = useDispatch();
  const { currentUser, isAuthChecked } = useSelector((state) => state.auth);

  const onLoading = async () => {
    const toastId = toast.loading("Loading In...");
    try {
      const { data } = await getCurrentUser();
      if (data.success) {
        dispatch(setCurrentUser(data.data));
      } else {
        toast.error(data.message, { id: toastId, duration: 3000 });
      }
    } catch (error) {
      toast.error(`${error?.response?.data?.message}`, {
        id: toastId,
        duration: 3000,
      });
    } finally {
      dispatch(setAuthChecked(true)); // <--- mark check complete
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    onLoading();
  }, []);

  if (!isAuthChecked)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <>
      <Toaster />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Landing Page as fallback/default */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/*" element={<LandingPage />} />

          {/* Auth Pages (accessible only to unverified or not-logged-in users) */}
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            }
          />
          {/* <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} /> */}

          {/* Email Verification Page (only for logged in but unverified users) */}
          <Route
            path="/verify"
            element={
              <EmailVerifyRoute>
                <Verify />
              </EmailVerifyRoute>
            }
          />

          {/* Protected Routes (only accessible to verified users) */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/:username" element={<Profile />} />
            <Route path="/post" element={<CreatePost />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
