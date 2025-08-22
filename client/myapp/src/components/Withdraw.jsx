import React from "react";
import {
  Alert,
  Button,
  Container,
  Paper,
  MenuItem,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createWithdraw } from "../features/WithdrawFeatures";
import Header from "./Header";

const Withdraw = () => {
  const dispatch = useDispatch();

  // ✅ Validation schema with Yup
  const validationSchema = Yup.object({
    bankNumber: Yup.string()
      .required("Bank number is required")
      .matches(/^[0-9]+$/, "Only digits allowed (no spaces)"),
    bankName: Yup.string().required("Bank name is required"),
    bankType: Yup.string()
      .notOneOf(["choose"], "Please select a valid bank branch")
      .required("Bank branch is required"),
    amount: Yup.number()
      .typeError("Amount must be a number")
      .positive("Amount must be greater than 0")
      .required("Amount is required"),
  });

  const formik = useFormik({
    initialValues: {
      bankNumber: "",
      bankName: "",
      bankType: "choose",
      amount: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      dispatch(createWithdraw(values));
      resetForm();
    },
  });

  return (
    <div className="w-full h-full">
      <Container maxWidth="xl">
        <Header />
        <div className="w-full h-screen flex items-center justify-center p-6">
          <Paper
            elevation={2}
            sx={{
              width: "100%",
              height: "auto",
              maxWidth: "500px",
              p: 3,
            }}
          >
            <Alert variant="filled" severity="info">
              After submit your request. Admin will check if you are eligible.
              Payment will be sent to your bank account which you provide in
              your withdraw request.
            </Alert>
            <h1 className="text-center text-2xl font-lisuBusa font-bold mt-5">
              Make Withdraw
            </h1>

            {/* ✅ Formik form */}
            <form
              className="w-full h-auto flex flex-col gap-y-3 p-4"
              onSubmit={formik.handleSubmit}
            >
              {/* Bank Number */}
              <label htmlFor="bankNumber">Bank Number</label>
              <input
                type="text"
                name="bankNumber"
                id="bankNumber"
                placeholder="Enter bank number without spaces"
                className="w-full h-10 p-2 border-2 border-gray-300 rounded-md"
                value={formik.values.bankNumber}
                onChange={(e) => {
                  // ✅ prevent spaces in real-time
                  const value = e.target.value.replace(/\s/g, "");
                  formik.setFieldValue("bankNumber", value);
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.bankNumber && formik.errors.bankNumber && (
                <p className="text-red-500 text-sm">
                  {formik.errors.bankNumber}
                </p>
              )}

              {/* Bank Name */}
              <label htmlFor="bankName">Bank Name</label>
              <input
                type="text"
                name="bankName"
                id="bankName"
                placeholder="Enter bank name"
                className="w-full h-10 p-2 border-2 border-gray-300 rounded-md"
                {...formik.getFieldProps("bankName")}
              />
              {formik.touched.bankName && formik.errors.bankName && (
                <p className="text-red-500 text-sm">
                  {formik.errors.bankName}
                </p>
              )}

              {/* Bank Type */}
              <label htmlFor="bankType">Bank Branch</label>
              <select
                name="bankType"
                id="bankType"
                className="w-full h-10 p-2 border-2 border-gray-300 rounded-md"
                {...formik.getFieldProps("bankType")}
              >
                <option value="choose">Choose Bank Branch</option>
                <option value="JazzCash">JazzCash</option>
                <option value="Easypaisa">Easypaisa</option>
                <option value="MeezanBank">Meezan Bank</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.bankType && formik.errors.bankType && (
                <p className="text-red-500 text-sm">
                  {formik.errors.bankType}
                </p>
              )}

              {/* Amount */}
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                name="amount"
                id="amount"
                placeholder="Enter amount"
                className="w-full h-10 p-2 border-2 border-gray-300 rounded-md"
                {...formik.getFieldProps("amount")}
              />
              {formik.touched.amount && formik.errors.amount && (
                <p className="text-red-500 text-sm">{formik.errors.amount}</p>
              )}

              <Button type="submit" variant="contained" color="success">
                Submit
              </Button>
            </form>
          </Paper>
        </div>
      </Container>
    </div>
  );
};

export default Withdraw;
