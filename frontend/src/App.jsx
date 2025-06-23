import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import AuthRoute from "./components/AuthRoute";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import SignedInRoute from "./components/SignedInRoute";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute>
              <HomePage />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <SignedInRoute>
              <SignupPage />
            </SignedInRoute>
          }
        />
        <Route
          path="/login"
          element={
            <SignedInRoute>
              <LoginPage />
            </SignedInRoute>
          }
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={
            <AuthRoute>
              <ProfilePage />
            </AuthRoute>
          }
        />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
