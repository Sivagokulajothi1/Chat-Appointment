import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import AuthLayout from "../layout/Authlayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import LoginPage from "../pages/Log_page/Login";
import SignUp from "../pages/Log_page/signup";
import OtpScreen from "../pages/Log_page/otp";
import MainLayout from "../layout/MainLayout/MainLayout";
import Doctors from "../pages/Doctors/Doctors";
import Slots from "../pages/Slots/Slots";
import Appointments from "../pages/Appointments/Appointments";
import WhatsApp from "../pages/WhatsApp/WhatsApp";
import Users from "../pages/Users/Users";
import Settings from "../pages/Settings/Settings";
import Analytics from "../pages/Analytics/Analytics";

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();

  const protectedRoutes = [
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/doctors", element: <Doctors /> },
    { path: "/slots", element: <Slots /> },
    { path: "/appointments", element: <Appointments /> },
    { path: "/whatsapp", element: <WhatsApp /> },
    { path: "/users", element: <Users /> },
    { path: "/settings", element: <Settings /> },
    { path: "/analytics", element: <Analytics /> },
  ];

  return (
    <Routes>
      {/* ================= AUTH ROUTES ================= */}
      <Route
        path="/"
        element={
          !isLoggedIn ? (
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />

      <Route
        path="/signup"
        element={
          !isLoggedIn ? (
            <AuthLayout>
              <SignUp />
            </AuthLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />

      <Route
        path="/otppage"
        element={
          !isLoggedIn ? (
            <AuthLayout>
              <OtpScreen />
            </AuthLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />

      {/* ================= PROTECTED ROUTES ================= */}
      {protectedRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            isLoggedIn ? (
              <MainLayout>
                {route.element}
              </MainLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      ))}

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

};

export default AppRoutes;
