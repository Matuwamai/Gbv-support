import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
import ProtectedRoute from "./components/ProtectedRoute"; 
import SignUp from "./pages/singup";
import "./index.css";
import Login from "./pages/login";
import Layout from "./components/Layout";
import NewPost from "./components/Createpost";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./pages/Dahboard";
import EmergencyPage from "./pages/Emergencycall";
import CasePage from "./pages/CasesPage";
import LandingPage from "./pages/LandingPage";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<LandingPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/newpost" element={<NewPost />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/emergency" element={<EmergencyPage />} />
                <Route path="/cases" element={<CasePage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
    </AuthContextProvider>
  </StrictMode>
);
