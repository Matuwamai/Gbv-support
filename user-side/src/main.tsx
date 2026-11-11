import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import SignUp from "./pages/singup";
import Login from "./pages/login";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./pages/Dahboard";
import EmergencyPage from "./pages/Emergencycall";
import LandingPage from "./pages/LandingPage";
import LearnPage from "./pages/LearnPage";
import UpdatePostPage from "./pages/EditPost";
import NotFound from "./pages/NotFound";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/emergency" element={<EmergencyPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/update-post/:postId" element={<UpdatePostPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  </StrictMode>
);
