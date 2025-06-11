// src/routes/AuthRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const { currentUser, isAuthChecked } = useSelector((state) => state.auth);

//   if (!isAuthChecked) return null;

  if (currentUser?.isVerified) return <Navigate to="/" />;

  return children;
};

export default AuthRoute;