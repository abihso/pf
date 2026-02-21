/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillSetting } from "react-icons/ai"; 
import { AiOutlineMessage } from "react-icons/ai";
import { ImFolderUpload } from "react-icons/im";
import { BsFillFileCheckFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { FiLogOut } from "react-icons/fi"; // Added logout icon
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarRightExpand,
} from "react-icons/tb";
import { HiMenu } from "react-icons/hi";
// pages
import Claims from "../pages/claims";
import Dashboard from "../pages/dashboard";
import Apply from "../pages/apply";
import Register from "../pages/register";
import Messages from "../pages/messages";
import Settings from "../pages/settings";

const Admin = () => {
  const navigate = useNavigate()
  const [infor, setInfor] = useState({
    status : ""
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const getVerificationResults = async () => {
      const response = await verifySession()
        setInfor(response.data.data)
    }
      getVerificationResults()
    
  }, [])
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("Dashboard")
  
  // Logout function
  const handleLogout = async () => {
    try {
      // Optional: Call logout endpoint if you have one
      // await axios.post(`${import.meta.env.VITE_HOST}/auth/logout`);
      
      // Clear token from localStorage
      localStorage.removeItem("token");
      
      // Redirect to login page
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear token and redirect even if API call fails
      localStorage.removeItem("token");
      navigate("/");
    }
  };
  
  let taps;
  if (infor.status == "admin") {
    taps = [
    { name: "Dashboard", icon: <MdSpaceDashboard className="text-xl md:text-2xl" /> },
    { name: "Register", icon: <FaUserPlus className="text-xl md:text-2xl" /> },
    { name: "Claims", icon: <BsFillFileCheckFill className="text-xl md:text-2xl" /> },
    { name: "Apply", icon: <ImFolderUpload className="text-xl md:text-2xl" /> },
    { name: "Messages", icon: <AiOutlineMessage className="text-xl md:text-2xl" /> },
    { name: "Settings", icon: <AiFillSetting className="text-xl md:text-2xl" /> },
  ]
} else {
  taps = [
    { name: "Dashboard", icon: <MdSpaceDashboard className="text-xl md:text-2xl" /> },
    { name: "Claims", icon: <BsFillFileCheckFill className="text-xl md:text-2xl" /> },
    { name: "Apply", icon: <ImFolderUpload className="text-xl md:text-2xl" /> },
    { name: "Messages", icon: <AiOutlineMessage className="text-xl md:text-2xl" /> },
    { name: "Settings", icon: <AiFillSetting className="text-xl md:text-2xl" /> },
  ];
  }
  
  const page = (pageName) => {
    switch (pageName) {
      case "Dashboard":
        return <Dashboard setHomePage={setCurrentPage} userData={infor} />
      case "Claims":
        return <Claims userData={infor} />
      case "Apply":
        return <Apply userData={infor} />
      case "Register":
        return <Register userData={infor} />
      case "Messages":
        return <Messages userData={infor} />
      case "Settings":
        return <Settings userData={infor} />
      default:
        return <Dashboard setHomePage={setCurrentPage} userData={infor} />
    }
  }
   
  const verifySession = async () => {
    let response
    try {
     response = await axios.post(`${import.meta.env.VITE_HOST}/auth/verify`, {
      token : window.localStorage.getItem("token") == null  ?  `no token` : window.localStorage.getItem("token")
    })
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      navigate("/")
    }

    return response
  }

  // Close mobile menu when page changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPage]);

  return (
    <div className="flex min-h-screen overflow-hidden relative">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR - Desktop only */}
      <div
        className={`
          bg-[#F1F2F7] h-screen flex-col
          transition-all duration-300 ease-in-out
          hidden lg:flex
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 h-14 border-[#E4E6EE] px-4 gap-2 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-7 h-7 bg-[#5A67BA] rounded-full flex-shrink-0">
              <p className="font-bold text-white text-base">W</p>
            </div>

            {!collapsed && (
              <p className="font-bold text-[#5A67BA] whitespace-nowrap text-sm md:text-base">
                WELFARE APP
              </p>
            )}
          </div>

          
        {
          !collapsed ? <TbLayoutSidebarRightExpand
            onClick={() => setCollapsed(!collapsed)}
            className="text-2xl text-[#98A1A8] cursor-pointer"
          /> : <TbLayoutSidebarLeftExpand
              onClick={() => setCollapsed(false)}
              className="text-2xl text-[#98A1A8] cursor-pointer"
            />
        }
          
        </div>

        {/* Menu - Desktop Navigation Taps */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-1">
          {taps.map((item, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-3 h-11 cursor-pointer rounded-md
                text-[#848B94] hover:bg-[#E4E6EE]
                ${collapsed ? "justify-center px-2" : "px-4"}
                ${currentPage === item.name ? "bg-[#E4E6EE] text-[#5A67BA] font-bold" : ""}
              `}
              onClick={() => setCurrentPage(item.name)}
            >
              <span className={`flex-shrink-0 ${currentPage === item.name ? "text-[#5A67BA]" : "text-[#C4C7DB]"}`}>
                {item.icon}
              </span>

              {!collapsed && (
                <span className="whitespace-nowrap text-sm md:text-base">
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Logout Button - Desktop */}
        <div className="border-t border-[#E4E6EE] p-2 flex-shrink-0">
          <div
            className={`
              flex items-center gap-3 h-11 cursor-pointer rounded-md
              text-red-500 hover:bg-red-50
              ${collapsed ? "justify-center px-2" : "px-4"}
              transition-colors duration-200
            `}
            onClick={handleLogout}
          >
            <FiLogOut className="text-xl md:text-2xl" />
            {!collapsed && (
              <span className="whitespace-nowrap text-sm md:text-base font-medium">
                Logout
              </span>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 w-full lg:w-auto">
        {/* Top Bar */}
        <div className="border-b-2 h-14 border-[#E4E6EE] flex items-center justify-between px-3 lg:pl-5">
          <div className="lg:hidden">
            {/* User info on mobile can go here */}
            <span className="text-sm text-[#AAAAAA]">
              {infor.fname}
            </span>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            {/* Mobile menu button - Opens right sidebar (visible only on mobile) */}
            <button 
              className="lg:hidden text-2xl text-[#98A1A8]"
              onClick={() => setMobileMenuOpen(true)}
            >
              <HiMenu />
            </button>
          </div>

         
        </div>

        {/* Content Area - Shows current page */}
        <div className="h-screen overflow-y-auto p-3 pb-5">
          {
            page(currentPage)
          }
        </div>
      </div>

      {/* RIGHT SIDEBAR - Mobile only navigation */}
      <div
        className={`
          bg-[#F1F2F7] h-screen fixed top-0 z-30 lg:hidden
          transition-all duration-300 ease-in-out shadow-xl flex flex-col
          ${mobileMenuOpen ? 'right-0' : '-right-64'}
          w-64
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 h-14 border-[#E4E6EE] px-4 gap-2 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-7 h-7 bg-[#5A67BA] rounded-full flex-shrink-0">
              <p className="font-bold text-white text-base">W</p>
            </div>

            <p className="font-bold text-[#5A67BA] whitespace-nowrap text-sm md:text-base">
              MENU
            </p>
          </div>

          {/* Close button for mobile sidebar */}
          <HiMenu 
            className="text-2xl text-[#98A1A8] cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>

        {/* Mobile Navigation Taps */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-1">
          {taps.map((item, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-3 h-12 cursor-pointer rounded-md
                text-[#848B94] hover:bg-[#E4E6EE] px-4 mx-2
                ${currentPage === item.name ? "bg-[#E4E6EE] text-[#5A67BA] font-bold" : ""}
                transition-colors duration-200
              `}
              onClick={() => setCurrentPage(item.name)}
            >
              <span className={`flex-shrink-0 text-xl ${currentPage === item.name ? "text-[#5A67BA]" : "text-[#C4C7DB]"}`}>
                {item.icon}
              </span>

              <span className="whitespace-nowrap text-base">
                {item.name}
              </span>
            </div>
          ))}
        </div>

        {/* Logout Button - Mobile */}
        <div className="border-t border-[#E4E6EE] p-2 flex-shrink-0">
          <div
            className="flex items-center gap-3 h-12 cursor-pointer rounded-md text-red-500 hover:bg-red-50 px-4 mx-2 transition-colors duration-200"
            onClick={handleLogout}
          >
            <FiLogOut className="text-xl" />
            <span className="whitespace-nowrap text-base font-medium">
              Logout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;