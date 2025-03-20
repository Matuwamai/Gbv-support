import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
import { DarkModeProvider } from "./context/darkModeContext";
import ProtectedRoute from "./components/protectedRoute"; // ✅ Import the fixed component
import SignUp from "./pages/singup";
import "./index.css";
import Login from "./pages/login";
import Layout from "./components/Layout";
import NewPost from "./components/Createpost";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./pages/Dahboard";
import EmergencyPage from "./pages/Emergencycall";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <DarkModeProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            {/* ✅ Wrap protected routes inside <ProtectedRoute> */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/newpost" element={<NewPost />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/emergency" element={<EmergencyPage />} />
              </Route>
            </Route>

          </Routes>
        </Router>
      </DarkModeProvider>
    </AuthContextProvider>
  </StrictMode>
);
