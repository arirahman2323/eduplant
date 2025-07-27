import React, { useContext, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import logo from "../../assets/images/logo.png";
import avatar from "../../assets/images/avatar.png";
import { UserContext } from "../../context/userContext";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { user } = useContext(UserContext);

  return (
    <div className="flex gap-5 bg-white border border-b border-gray-200 backdrop-blur-[2px] sticky top-0 z-30 py-2 px-8">
      <button
        className="block lg:hidden text-black"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
      </button>

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-1">
          <img src={logo} alt="Logo" className="h-6" />
          <h2 className="text-lg font-medium text-black">EduPlant Metrics</h2>
        </div>
        <div className="hidden md:flex items-center justify-center gap-2">
          <div className="relative">
            <img src={user?.profileImageUrl || avatar} alt="Profile Image" className="w-8 h-8 bg-slate-400 rounded-full" />
          </div>

          <div className="flex flex-col justify-center">
            <h5 className="text-gray-950 text-xs font-medium leading-6">{user?.name || ""}</h5>
            <p className="text-[10px] text-gray-500">{user?.email || ""}</p>
          </div>
        </div>
      </div>

      {openSideMenu && (
        <div className="fixed top-[40px] -ml-8 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
