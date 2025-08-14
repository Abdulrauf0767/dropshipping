import React from "react";
import { Paper, Alert } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addSeller } from "../features/SellerFeature";

// Validation schema
const validationSchema = Yup.object({
  phoneNumber: Yup.string()
    .matches(/^\d+$/, "Phone number must be digits only")
    .min(10, "Phone number must be at least 10 digits")
    .max(13, "Phone number must be at most 13 digits")
    .required("Phone number is required"),
  bankNumber: Yup.string()
    .matches(/^\d+$/, "Bank number must be digits only")
    .min(8, "Bank number must be at least 8 digits")
    .max(20, "Bank number must be at most 20 digits")
    .required("Bank number is required"),
});

const SellerInformation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = React.useState("");

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
      bankNumber: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setErrorMessage(""); // clear any old errors
        const res = await dispatch(addSeller(values)).unwrap();

        // If seller is created successfully
        if (res && res.seller) {
          resetForm();
          navigate(`/home/buy-now-for-someone/${id}`);
        }
      } catch (err) {
        console.error("Failed to create seller:", err);
        setErrorMessage(err?.message || "Something went wrong. Please try again.");
      }
    },
  });

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-5 gap-y-5">
      <Alert variant="filled" severity="info">
        You can add your Easy Paisa, Jazz Cash, and IBAN account number.
      </Alert>

      {errorMessage && (
        <Alert variant="filled" severity="error">
          {errorMessage}
        </Alert>
      )}

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "500px",
          padding: "10px",
          height: "auto",
        }}
      >
        <h2 className="text-2xl font-bold font-lisuBusa mt-10 text-center">
          Seller Information
        </h2>

        <form
          onSubmit={formik.handleSubmit}
          className="w-full md:w-[500px] h-auto flex flex-col items-start gap-y-3 p-5"
        >
          {/* Phone Number */}
          <label htmlFor="phoneNumber" className="font-lisuBusa">
            Phone Number
          </label>
          <input
            type="number"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="Enter your phone number without spaces"
            className={`w-full p-2 border-2 rounded-md ${
              formik.touched.phoneNumber && formik.errors.phoneNumber
                ? "border-red-500"
                : "border-gray-400"
            }`}
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <p className="text-red-500 text-sm">{formik.errors.phoneNumber}</p>
          )}

          {/* Bank Number */}
          <label htmlFor="bankNumber" className="font-lisuBusa">
            Bank Number
          </label>
          <input
            type="text"
            name="bankNumber"
            id="bankNumber"
            placeholder="Enter your bank number without spaces"
            className={`w-full p-2 border-2 rounded-md ${
              formik.touched.bankNumber && formik.errors.bankNumber
                ? "border-red-500"
                : "border-gray-400"
            }`}
            value={formik.values.bankNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.bankNumber && formik.errors.bankNumber && (
            <p className="text-red-500 text-sm">{formik.errors.bankNumber}</p>
          )}

          {/* Submit Button */}
          <div className="w-full flex items-center justify-center mt-5">
            <button
              type="submit"
              className="w-[200px] h-[50px] bg-blue-500 text-white font-lisuBusa rounded-md hover:bg-blue-600 transition duration-300"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default SellerInformation;
