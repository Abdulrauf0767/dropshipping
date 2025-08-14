import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userGetRole } from "../features/UserFeature";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, status } = useSelector((state) => state.user);

  const token = localStorage.getItem("token");
  const role = user?.user?.role;

  // Agar token hai lekin role nahi hai -> role fetch karo
  useEffect(() => {
    if (token && !role && status === "idle") {
      dispatch(userGetRole());
    }
  }, [dispatch, token, role, status]);

  // Agar token hi nahi hai
  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Loading state jab tak role fetch ho raha ho
  if (status === "loading" && !role) {
    return <div>Loading...</div>;
  }

  // Role aane ke baad check karo
  if (role && allowedRoles.includes(role)) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
