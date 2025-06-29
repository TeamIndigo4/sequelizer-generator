import React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import InputField from "../../components/form_components/InputField";
import PasswordField from "../../components/form_components/PasswordField";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import HollowIconButton from "../../components/buttons/HollowIconButton";
import {
  MdEmail,
  RiLockPasswordFill,
  MdLogin,
  FaUserLock,
  FcGoogle,
} from "../../utils/iconsProvider";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase_config";
import Loader from "../../components/common_components/Loader";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(
        email ? "Email field not filled!" : "Password field not filled"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        toast.success(response?.data.message);
        const user_id = response.data.user_id;
        console.log('user id obtained from login: ', user_id);
        navigate("/auth/verifyotp", { state: { user_id, purpose: "login" } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed! Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      const uid = user.uid;
      const email = user.email;

      setIsGoogleLoading(true);

      // Send to your backend
      const response = await axiosInstance.post("/auth/google-login", {
        email,
        uid,
      });

      if (response.status === 200) {
        toast.success(response.data.message || "Google login successful");
        const user_id = response.data.user_id;
        navigate("/auth/verifyotp", { state: { user_id, purpose: "login" } });
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google login failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-md bg-white dark:bg-transparent rounded-lg p-6 flex flex-col gap-8">
        <header className="flex flex-col items-center gap-1">
          <div className="h-10 w-10 border border-[#e0e0e0] text-secondary dark:text-gray-light1 rounded-lg flex items-center justify-center mb-5 ">
            <FaUserLock className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold mb-2 dark:text-white">
            Hi, Welcome Back
          </h1>
          <p className="text-center text-sm font-light text-secondary-txt dark:text-gray-light2">
            Enter your credentials to access your account
          </p>
        </header>
        <form className="flex flex-col gap-y-4" onSubmit={handleLogin}>
          <InputField
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            icon={MdEmail}
            value={email}
            onChange={setEmail}
            required={true}
          />

          <PasswordField
            label="Password"
            name="password"
            id="password"
            placeholder="Enter your password"
            icon={RiLockPasswordFill}
            value={password}
            onChange={setPassword}
            required={true}
          />

          <div className="flex justify-between items-center gap-x-3">
            {/* Remember Me Checkbox */}
            <div className="flex items-center text-sm text-primary-txt cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 accent-primary-btn cursor-pointer"
                id="rememberMe"
              />
              <p className="dark:text-[#b8b8b8]">Remember Me</p>
            </div>

            {/* Forgot Password Link */}
            <div>
              <Link
                to="/auth/forgotpassword"
                className="w-full text-sm text-link font-semibold dark:text-white"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-y-3 mt-2">
            <SolidIconBtn
              icon={isLoading ? null : MdLogin}
              text={isLoading ? <Loader text={"Logging in..."} /> : "Login"}
              className="bg-primary hover:bg-blue-700 text-white"
              type="submit"
              disabled={isLoading}
            />

            <div className="flex items-center dark:text-gray-light1">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-sm text-gray-500 font-medium dark:text-gray-light1">
                OR
              </span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <HollowIconButton
              icon={isGoogleLoading ? null : FcGoogle}
              text={
                isGoogleLoading ? (
                  <Loader text={"Logging in..."} />
                ) : (
                  "Sign in with Google"
                )
              }
              onClick={handleGoogleLogin}
              className="border-gray-300 hover:bg-gray-100 text-gray-700"
            />
          </div>

          <p className="text-sm text-center text-primary-txt font-light dark:text-gray-light2">
            Don't have an account?{" "}
            <Link
              to="/auth/registration"
              className="text-link font-medium text-primary"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
