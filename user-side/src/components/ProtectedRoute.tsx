import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { Authcontext } from "../context/authContext"; 

const ProtectedRoute = () => {
  const auth = useContext(Authcontext); 

  return auth?.currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
