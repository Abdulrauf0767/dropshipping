import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, userGetRole } from "../features/UserFeature";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const token = localStorage.getItem("token");
  const [errorMessage, setErrorMessage] = useState(""); // <-- error message state

  // If token exists but role not fetched, dispatch role fetch, else navigate based on role
  useEffect(() => {
    if (token && !user?.user?.role) {
      dispatch(userGetRole());
    }
    if (user?.user?.role) {
      navigateBasedOnRole(user.user.role);
    }
  }, [token, user?.user?.role, dispatch]);

  const navigateBasedOnRole = (role) => {
    if (role === "admin") navigate("/admin");
    else if (role === "seller") navigate("/home");
    else if (role === "vendor") navigate("/vendor");
    else if (role === "user") navigate("/home");
    else navigate("/");
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Valid email enter karo")
        .required("Email required hai"),
      password: Yup.string()
        .min(6, "Password kam se kam 6 characters ka hona chahiye")
        .required("Password required hai"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setErrorMessage(""); // Clear previous errors
      try {
        const res = await dispatch(login(values)).unwrap();
        localStorage.setItem("token", res.token);
        navigateBasedOnRole(res.user?.role);
        resetForm();
      } catch (error) {
        console.log(error);
        // Set error message for UI display
        if (error?.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
      }
    },
  });

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 font-sans"
      style={{ fontFamily: "'Lisu Busa', sans-serif" }}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-[400px]">
        <h2 className="text-center mb-6 text-blue-600 text-2xl font-bold">
          Login
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Error message above submit */}
          {errorMessage && (
            <p className="text-red-600 text-center mb-2 font-semibold">
              {errorMessage}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium shadow-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Signup link */}
        <div className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
