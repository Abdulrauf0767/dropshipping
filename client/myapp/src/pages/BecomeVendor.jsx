import React from "react";
import { Alert, Paper } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { becomeVendor } from "../features/VendorFeatures";

const BecomeVendor = () => {
  const dispatch = useDispatch();

  // ✅ Yup Validation Schema
  const validationSchema = Yup.object({
    storeLogo: Yup.mixed().required("Store Logo is required"),
    storeName: Yup.string().required("Store Name is required"),
    storeDescription: Yup.string().required("Store Description is required"),
    phoneNumber: Yup.string()
      .matches(/^\d+$/, "Only numbers are allowed")
      .required("Phone Number is required"),
    CNIC: Yup.string()
      .matches(/^\d+$/, "Only numbers are allowed")
      .required("CNIC is required"),
    cnicFrontImage: Yup.mixed().required("CNIC Front Image is required"),
    cnicBackImage: Yup.mixed().required("CNIC Back Image is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    transactionImage: Yup.mixed().required("Transaction Image is required"),
    postalCode: Yup.string()
      .matches(/^\d+$/, "Only numbers are allowed")
      .required("Postal Code is required"),
    accountNumber: Yup.string()
      .matches(/^\d+$/, "Only numbers are allowed")
      .required("Account Number is required"),
    country: Yup.string().required("Country is required"),
    websiteURL: Yup.string().url("Invalid URL").nullable(),
  });

  // ✅ Formik Hook
  const formik = useFormik({
    initialValues: {
      storeLogo: null,
      storeName: "",
      storeDescription: "",
      phoneNumber: "",
      CNIC: "",
      cnicFrontImage: null,
      cnicBackImage: null,
      address: "",
      city: "",
      transactionImage: null,
      postalCode: "",
      accountNumber: "",
      country: "Pakistan", // ✅ Fixed default value
      websiteURL: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const res = await dispatch(becomeVendor(values)).unwrap();
        if (res && res.vendor) {
          alert("✅ Your form has been submitted successfully!");
          resetForm();
        }
      } catch (error) {
        console.error("Vendor creation failed:", error);
        alert("❌ Something went wrong, please try again.");
      } finally {
        setSubmitting(false); // ✅ formik ko batana ke submit complete ho gaya
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-auto p-6 w-full bg-gray-50">
      <Paper
        elevation={3}
        sx={{
          maxWidth: "500px",
          padding: "10px",
          flexDirection: "column",
          display: "flex",
          rowGap: "10px",
          alignItems: "center",
        }}
      >
        {/* Info Section */}
        <Alert severity="info" sx={{ width: "100%" }}>
          Read carefully before becoming a vendor.
          <br />
          First: In RS 1500 you can add unlimited products and sell them.
          <br />
          Second: You get payment after withdrawal limit (set by admin).
          <br />
          Third: Send payment to admin account and upload transaction image.
          <br />
          Fourth: After verification, if eligible, you can add products.
          <br />
          Fifth: If not eligible, your payment will be refunded.
        </Alert>

        <Alert severity="warning" sx={{ width: "100%" }}>
          Your documents should be clear and readable.
          <br />
          Your address should match with your CNIC.
        </Alert>

        <Alert severity="info" sx={{ width: "100%" }}>
          Send Money to this account: <b>03094889630</b>
        </Alert>

        {/* Form Start */}
        <form
          className="w-full h-auto p-4 flex flex-col gap-y-4 items-start"
          onSubmit={formik.handleSubmit}
        >
          {/* Store Logo */}
          <label htmlFor="storeLogo" className="font-lisuBusa">
            Store Logo
          </label>
          <input
            type="file"
            name="storeLogo"
            accept="image/*"
            className="w-full h-10 p-2 border border-gray-300 rounded-md"
            onChange={(e) =>
              formik.setFieldValue("storeLogo", e.currentTarget.files[0])
            }
          />
          {formik.touched.storeLogo && formik.errors.storeLogo && (
            <div className="text-red-500 text-sm">
              {formik.errors.storeLogo}
            </div>
          )}

          {/* Store Name */}
          <label htmlFor="storeName" className="font-lisuBusa">
            Store Name
          </label>
          <input
            type="text"
            name="storeName"
            placeholder="Store Name"
            className="w-full h-10 p-2 border border-gray-300 rounded-md"
            {...formik.getFieldProps("storeName")}
          />
          {formik.touched.storeName && formik.errors.storeName && (
            <div className="text-red-500 text-sm">
              {formik.errors.storeName}
            </div>
          )}

          {/* Store Description */}
          <label htmlFor="storeDescription" className="font-lisuBusa">
            Store Description
          </label>
          <input
            type="text"
            name="storeDescription"
            placeholder="Store Description"
            className="w-full h-10 p-2 border border-gray-300 rounded-md"
            {...formik.getFieldProps("storeDescription")}
          />
          {formik.touched.storeDescription &&
            formik.errors.storeDescription && (
              <div className="text-red-500 text-sm">
                {formik.errors.storeDescription}
              </div>
            )}

          {/* Phone Number */}
          <label htmlFor="phoneNumber" className="font-lisuBusa">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number without spaces"
            className="w-full h-10 p-2 border border-gray-300 rounded-md"
            {...formik.getFieldProps("phoneNumber")}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <div className="text-red-500 text-sm">
              {formik.errors.phoneNumber}
            </div>
          )}

          {/* CNIC */}
          <label htmlFor="CNIC" className="font-lisuBusa">
            CNIC
          </label>
          <input
            type="text"
            name="CNIC"
            placeholder="CNIC without spaces"
            className="w-full h-10 p-2 border border-gray-300 rounded-md"
            {...formik.getFieldProps("CNIC")}
          />
          {formik.touched.CNIC && formik.errors.CNIC && (
            <div className="text-red-500 text-sm">{formik.errors.CNIC}</div>
          )}

          {/* CNIC Front Image */}
          <label htmlFor="cnicFrontImage" className="font-lisuBusa">
            CNIC Front Image
          </label>
          <input
            type="file"
            name="cnicFrontImage"
            accept="image/*"
            className="w-full h-10 p-2 border border-gray-300 rounded-md"
            onChange={(e) =>
              formik.setFieldValue("cnicFrontImage", e.currentTarget.files[0])
            }
          />
          {formik.touched.cnicFrontImage && formik.errors.cnicFrontImage && (
            <div className="text-red-500 text-sm">
              {formik.errors.cnicFrontImage}
            </div>
          )}

          {/* CNIC Back Image */}
          <label htmlFor="cnicBackImage" className="font-lisuBusa">
            CNIC Back Image
          </label>
          <input
            type="file"
            name="cnicBackImage"
            accept="image/*"
            className="w-full h-10 p-2 border border-gray-300 rounded-md"
            onChange={(e) =>
              formik.setFieldValue("cnicBackImage", e.currentTarget.files[0])
            }
          />
          {formik.touched.cnicBackImage && formik.errors.cnicBackImage && (
            <div className="text-red-500 text-sm">
              {formik.errors.cnicBackImage}
            </div>
          )}

          {/* Address */}
          <label htmlFor="address" className="font-lisuBusa">
            Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="w-full h-10 p-2 border border-gray-300 rounded-md"
            {...formik.getFieldProps("address")}
          />
          {formik.touched.address && formik.errors.address && (
            <div className="text-red-500 text-sm">{formik.errors.address}</div>
          )}

          {/* City */}
          <label htmlFor="city" className="font-lisuBusa">
            City
          </label>
          <input
            type="text"
            name="city"
            placeholder="City"
            className="w-full h-10 p-2 border border-gray-300 rounded-md"
            {...formik.getFieldProps("city")}
          />
          {formik.touched.city && formik.errors.city && (
            <div className="text-red-500 text-sm">{formik.errors.city}</div>
          )}

          {/* Transaction Image */}
          <label htmlFor="transactionImage" className="font-lisuBusa">
            Transaction Image
          </label>
          <input
            type="file"
            name="transactionImage"
            accept="image/*"
            className="w-full h-10 p-2 border border-gray-300 rounded-md"
            onChange={(e) =>
              formik.setFieldValue("transactionImage", e.currentTarget.files[0])
            }
          />
          {formik.touched.transactionImage &&
            formik.errors.transactionImage && (
              <div className="text-red-500 text-sm">
                {formik.errors.transactionImage}
              </div>
            )}

          {/* Postal Code */}
          <label htmlFor="postalCode" className="font-lisuBusa">
            Postal Code
          </label>
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            className="w-full h-10 p-2 border border-gray-300 rounded-md"
            {...formik.getFieldProps("postalCode")}
          />
          {formik.touched.postalCode && formik.errors.postalCode && (
            <div className="text-red-500 text-sm">
              {formik.errors.postalCode}
            </div>
          )}

          {/* Account Number */}
          <label htmlFor="accountNumber" className="font-lisuBusa">
            Account Number
          </label>
          <input
            type="text"
            name="accountNumber"
            placeholder="Account Number"
            className="w-full h-10 p-2 border border-gray-300 rounded-md"
            {...formik.getFieldProps("accountNumber")}
          />
          {formik.touched.accountNumber && formik.errors.accountNumber && (
            <div className="text-red-500 text-sm">
              {formik.errors.accountNumber}
            </div>
          )}

          {/* Country (Fixed Pakistan) */}
          <label htmlFor="country" className="font-lisuBusa">
            Country
          </label>
          <input
            type="text"
            name="country"
            value="Pakistan"
            readOnly
            className="w-full h-10 p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />

          {/* Website URL (Optional) */}
          <label htmlFor="websiteURL" className="font-lisuBusa">
            Website URL (optional)
          </label>
          <input
            type="text"
            name="websiteURL"
            placeholder="Website URL"
            className="w-full h-10 p-2 border border-gray-300 rounded-md"
            {...formik.getFieldProps("websiteURL")}
          />
          {formik.touched.websiteURL && formik.errors.websiteURL && (
            <div className="text-red-500 text-sm">
              {formik.errors.websiteURL}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full h-10 rounded-md font-lisuBusa text-white ${
              formik.isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </Paper>
    </div>
  );
};

export default BecomeVendor;
