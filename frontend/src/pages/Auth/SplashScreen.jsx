import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { UserContext } from "../../context/userContext";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      const role = localStorage.getItem("role");
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-[#f8fbfd]">
      <div className="text-center border border-dashed border-blue-400 px-10 py-8 rounded-xl">
        <div className="flex items-center justify-center gap-4 mb-6">
          <img src={logo} alt="Logo" className="h-16 md:h-20" />
          <h1 className="text-2xl md:text-3xl font-semibold text-blue-600">EduPlant Metrics</h1>
        </div>
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">Selamat Datang, {user?.name || "..."}</h1>
        <p className="text-sm md:text-base text-gray-600">Persiapkan dirimu untuk belajar</p>

        <div className="mt-6 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-black"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
