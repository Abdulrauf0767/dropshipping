import React from "react";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className="w-[20%] h-full border-r border-gray-200">
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div className="w-[80%] h-full overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
