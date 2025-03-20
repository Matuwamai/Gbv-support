import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { Authcontext } from "../context/authContext"; // Ensure correct import

const ProtectedRoute = () => {
  const auth = useContext(Authcontext); // ✅ Correct way to use context

  return auth?.currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
