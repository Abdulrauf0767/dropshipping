import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiChevronLeft,
  FiUser,
  FiBox,
  FiPlusSquare,
  FiGrid,
} from "react-icons/fi";
import {
  BlockOutlined,
  FaceRetouchingOffOutlined,
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
  LogoutOutlined,
  PendingOutlined,
  StorefrontOutlined,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { logout } from "../features/UserFeature";

const AdminDashboardLayout = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  const SideBarNav = [
    { icon: FiGrid, text: "Dashboard", link: "/admin/dashboard" },
    { icon: FiUser, text: "Users", link: "/admin/users" },
    { icon: StorefrontOutlined, text: "Vendors", link: "/admin/vendors" },
    { icon: PendingOutlined, text: " Pending Vendors", link: "/admin/pending-vendors" },
    { icon: BlockOutlined, text: " Blocked Vendors", link: "/admin/blocked-vendors" },
    { icon: FaceRetouchingOffOutlined, text: " Rejected Vendors", link: "/admin/rejected-vendors" },
  ];

  const productSubmenu = [
    { icon: FiPlusSquare, text: "Add Product", link: "/admin/uploadproduct" },
    { icon: FiGrid, text: "Categories", link: "/admin/categories" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out
          ${open ? "w-60" : "w-16"} h-screen fixed top-0 left-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-3 border-b">
          {open && <h1 className="text-lg font-bold">Admin</h1>}
          <button className="text-xl" onClick={() => setOpen(!open)}>
            {open ? <FiChevronLeft /> : <FiMenu />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-4">
          {/* Main Nav Items */}
          {SideBarNav.map((item, idx) => {
            const isActive = location.pathname === item.link;
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.link}
                className={`flex items-center p-3 rounded-md mx-2 mb-1 transition-colors
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-blue-100 hover:text-blue-600"
                  }`}
              >
                <Icon className="text-lg" />
                {open && <span className="ml-3">{item.text}</span>}
              </NavLink>
            );
          })}

          {/* Products Management */}
          <button
            onClick={() => setProductMenuOpen(!productMenuOpen)}
            className="flex items-center w-full p-3 rounded-md mx-2 mb-1 hover:bg-blue-100 hover:text-blue-600 transition-colors"
          >
            <FiBox className="text-lg" />
            {open && <span className="ml-3 flex-1">Products Management</span>}
            {open && (
              <span>
                {productMenuOpen ? (
                  <KeyboardArrowUpOutlined />
                ) : (
                  <KeyboardArrowDownOutlined />
                )}
              </span>
            )}
          </button>

          {/* Product Submenu */}
          {productMenuOpen && (
            <div
              className={`transition-all overflow-hidden ${
                open ? "pl-8" : ""
              }`}
            >
              {productSubmenu.map((sub, idx) => {
                const SubIcon = sub.icon;
                const isActive = location.pathname === sub.link;
                return (
                  <NavLink
                    key={idx}
                    to={sub.link}
                    className={`flex items-center p-3 rounded-md mx-2 mb-1 transition-colors
                      ${
                        isActive
                          ? "bg-blue-100 text-blue-600"
                          : "hover:bg-blue-100 hover:text-blue-600"
                      }`}
                  >
                    <SubIcon className="text-lg" />
                    {open && <span className="ml-3">{sub.text}</span>}
                  </NavLink>
                );
              })}
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-md mx-2 mt-4 transition-colors text-red-500 hover:bg-red-100 hover:text-red-600"
          >
            <LogoutOutlined fontSize="small" />
            {open && <span className="ml-3">Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out
          ${open ? "ml-60" : "ml-16"} p-5`}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-white p-3 shadow rounded-md mb-5">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        </div>

        {/* Page Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
