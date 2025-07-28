// app.jsx
import { Suspense, lazy, useEffect } from "react";
import { Route, Routes } from "react-router";
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
const About = lazy(() => import("./pages/About.jsx"));
const PasswordReset = lazy(() => import("./pages/PasswordReset.jsx")); // new page

// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AuthRoute from "./routes/AuthRoute.jsx";
import EmailVerifyRoute from "./routes/EmailVerifyRoute.jsx";
import { getCurrentUser } from "./api/user.api.js";
import { FullPageLoader } from "./components/skeleton/FullPageLoader.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { currentUser, isAuthChecked } = useSelector((state) => state.auth);

  const onLoading = async () => {
    try {
      const { data } = await getCurrentUser();
      if (data.success) {
        dispatch(setCurrentUser(data.data));
      } 
    } catch {
      toast("Login to Enjoy");
    } finally {
      dispatch(setAuthChecked(true)); // <--- mark check complete
    }
  };

  useEffect(() => {
    onLoading();
  }, []);
  
if (!isAuthChecked) return <FullPageLoader />;

  return (
    <>
      <Toaster />
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          {/* Landing Page as fallback/default */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
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
          <Route path="/password-reset" element={<AuthRoute><PasswordReset /></AuthRoute>} />

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
            <Route path="/about" element={<About />} />
            {/* <Route path="/chat" element={<Chat />} /> */}
            <Route path="/chat/:chatId?" element={<Chat />} />

          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
