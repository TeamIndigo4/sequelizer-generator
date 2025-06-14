import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import { AuthContextProvider } from "./contexts/AuthContext";
import AuthLayout from "./layouts/AuthLayout";
import Login from "../src/pages/auth/Login";
import Registration from "../src/pages/auth/Registration";
import ForgotPassword from "../src/pages/auth/ForgotPassword";
import ResetPassword from "../src/pages/auth/ResetPassword";
import VerifyOTP from "../src/pages/auth/VerifyOTP";
import UserLayout from "./layouts/UserLayout";
import Dashboard from "./pages/main/Dashboard";
import Models from "./pages/main/GenerateModel";
import LandingPage from "./pages/LandingPage";
import RelationshipMapping from "./pages/main/RelationshipMaping";
import ProtectedRoute from "./contexts/ProtectedRoutes";
import { ModelContextProvider } from "./contexts/ModelContext";

export default function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
      handle: { title: "Sequelizer" },
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <Login />,
          handle: { title: "Login | Sequelizer" },
        },
        {
          path: "registration",
          element: <Registration />,
          handle: { title: "Register | Sequelizer" },
        },
        {
          path: "forgotpassword",
          element: <ForgotPassword />,
          handle: { title: "Forgot Password | Sequelizer" },
        },
        {
          path: "resetpassword",
          element: <ResetPassword />,
          handle: { title: "Reset Password | Sequelizer" },
        },
        {
          path: "verifyotp",
          element: <VerifyOTP />,
          handle: { title: "Verify OTP | Sequelizer" },
        },
      ],
    },
    {
      path: "/seq",
      element: <UserLayout />,
      children: [
        {
          path: "dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
          handle: { title: "Dashboard | Sequelizer" },
        },
        {
          path: "models",
          element: (
            <ProtectedRoute>
              <Models />
            </ProtectedRoute>
          ),
          handle: { title: "Models Generation | Sequelizer" },
        },
        {
          path: "relationship",
          element: (
            <ProtectedRoute>
              <RelationshipMapping />
            </ProtectedRoute>
          ),
          handle: { title: "Relation | Sequeelizer" },
        },
      ],
    },
  ]);

  return (
    <>
      <AuthContextProvider>
        <ThemeContextProvider>
          <ModelContextProvider>
            <Toaster position="top-center" />
            <RouterProvider router={routes} />
          </ModelContextProvider>
        </ThemeContextProvider>
      </AuthContextProvider>
    </>
  );
}
