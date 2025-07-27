import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    setError("");
    // Login API
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        // Simpan role di localStorage agar bisa diakses di SplashScreen
        localStorage.setItem("role", role);

        // Redirect dulu ke splash screen
        navigate("/splash");
        // Rediret based on role
        // if (role === "admin") {
        //   navigate("/admin/dashboard");
        // } else {
        //   navigate("/user/dashboard");
        // }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, Please try again");
      }
    }
  };
  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full bg-white rounded-2xl p-6 shadow-md flex flex-col justify-center">
        <h3 className="text-xl text-center font-semibold text-black mb-6">Sign in to your account</h3>

        <form onSubmit={handleLogin}>
          <Input value={email} onChange={({ target }) => setEmail(target.value)} label="Email Address" placeholder="email@example.com" type="text" />
          <Input value={password} onChange={({ target }) => setPassword(target.value)} label="Password" placeholder="Min 8 Characters" type="password" />

          {error && <p className="text-xs pb-2.5 text-red-500">{error}</p>}

          <button type="submit" className="btn-gray">
            Sign In
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="text-primary font-medium underline" to="/signUp">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
