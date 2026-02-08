import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import AuthLayout from "../layout/Authlayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import LoginPage from "../pages/Log_page/Login";
import SignUp from "../pages/Log_page/signup";
import MainLayout from "../layout/MainLayout/MainLayout";
import Doctors from "../pages/Doctors/Doctors";
import Slots from "../pages/Slots/Slots";
import Appointments from "../pages/Appointments/Appointments";
import WhatsApp from "../pages/WhatsApp/WhatsApp";
import Users from "../pages/Users/Users";
import Settings from "../pages/Settings/Settings";
import Analytics from "../pages/Analytics/Analytics";
import Patient from "../pages/patient/patient";

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();

  const protectedRoutes = [
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/doctors", element: <Doctors /> },
    { path: "/patients", element: <Patient /> },
    { path: "/slots", element: <Slots /> },
    { path: "/appointments", element: <Appointments /> },
    { path: "/whatsapp", element: <WhatsApp /> },
    { path: "/users", element: <Users /> },
    { path: "/settings", element: <Settings /> },
    { path: "/analytics", element: <Analytics /> },
  ];

  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="/"
        element={
          !isLoggedIn ? (
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          ) : (
            <Navigate to="/dashboard" />
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
            <Navigate to="/dashboard" />
          )
        }
      />

      {/* Protected Routes */}
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
              <Navigate to="/" />
            )
          }
        />
      ))}
    </Routes>
  );
};

export default AppRoutes;
