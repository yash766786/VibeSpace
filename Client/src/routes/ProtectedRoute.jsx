// src/routes/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { currentUser, isAuthChecked } = useSelector((state) => state.auth);

//   if (!isAuthChecked) return null; // or show loader

  if (!currentUser) return <Navigate to="/landing" />;
  if (!currentUser.isVerified) return <Navigate to="/verify" />;

  return children;
};

export default ProtectedRoute;