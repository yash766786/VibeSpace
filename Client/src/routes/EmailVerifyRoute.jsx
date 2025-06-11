// src/routes/EmailVerifyRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const EmailVerifyRoute = ({ children }) => {
  const { currentUser, isAuthChecked } = useSelector((state) => state.auth);

//   if (!isAuthChecked) return null;

  if (!currentUser) return <Navigate to="/login" />;
  if (currentUser.isVerified) return <Navigate to="/" />;

  return children;
};

export default EmailVerifyRoute;