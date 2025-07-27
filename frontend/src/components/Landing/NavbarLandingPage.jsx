import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

function NavbarLandingPage() {
  // State to manage the visibility of the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full px-6 md:px-14 py-4 flex justify-between items-center bg-white shadow-sm">
      {/* Logo and Brand Name */}
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="h-6" />
        <span className="text-sm font-semibold">EduPlant Metrics</span>
      </div>

      {/* Desktop Navigation Links */}
      <ul className="hidden md:flex space-x-6 text-sm text-gray-700 font-medium">
        <li>
          <a href="#tentang" className="hover:text-blue-600">
            Tentang
          </a>
        </li>
        <li>
          <a href="#fitur" className="hover:text-blue-600">
            Fitur
          </a>
        </li>
        <li>
          <a href="#petunjuk" className="hover:text-blue-600">
            Petunjuk
          </a>
        </li>
        <li>
          <a href="#kontak" className="hover:text-blue-600">
            Kontak
          </a>
        </li>
      </ul>

      {/* Desktop Login/Signup Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <Link to="/login" className="text-sm px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
          Log In
        </Link>
        <Link to="/signup" className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu Button (Hamburger) */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden">
          <ul className="flex flex-col items-center p-4 space-y-4 text-sm text-gray-700 font-medium">
            <li>
              <a href="#tentang" onClick={() => setIsMenuOpen(false)}>
                Tentang
              </a>
            </li>
            <li>
              <a href="#fitur" onClick={() => setIsMenuOpen(false)}>
                Fitur
              </a>
            </li>
            <li>
              <a href="#petunjuk" onClick={() => setIsMenuOpen(false)}>
                Petunjuk
              </a>
            </li>
            <li>
              <a href="#kontak" onClick={() => setIsMenuOpen(false)}>
                Kontak
              </a>
            </li>
          </ul>
          <div className="flex flex-col items-center space-y-4 p-4 border-t border-gray-200">
            <Link to="/login" className="w-full text-center text-sm px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="w-full text-center text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavbarLandingPage;
