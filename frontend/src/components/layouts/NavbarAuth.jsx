import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const NavbarAuth = () => {
  return (
    <nav className="fixed top-0 z-50 w-full px-14 py-4 flex justify-between items-center bg-white border-b border-gray-200">
      <Link to="/" className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="h-6" />
        <h2 className="text-lg font-medium text-black">EduPlant Metrics</h2>
      </Link>
      <div className="space-x-4 hidden md:flex">
        <Link to="/login" className="text-sm px-4 py-1 border border-gray-300 rounded hover:bg-gray-100">
          Log In
        </Link>
        <Link to="/signup" className="text-sm px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default NavbarAuth;
