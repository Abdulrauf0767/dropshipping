// RejectedVendors.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Paper } from "@mui/material";
import { allrejectedVendors } from "../features/VendorFeatures";

const RejectedVendors = () => {
  const dispatch = useDispatch();
  const rejectedVendors = useSelector((state) => state.vendor.list);
  const { status, error } = useSelector((state) => state.vendor);

  useEffect(() => {
    if (status === "idle") {
      dispatch(allrejectedVendors());
    }
  }, [status, dispatch]);

  return (
    <div className="w-full h-full flex items-center justify-center p-5">
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        {status === "loading" && (
          <p className="text-center">Loading rejected vendors...</p>
        )}
        {status === "failed" && (
          <p className="text-red-500">{error}</p>
        )}
        {rejectedVendors.map((vendor) => (
          <Paper
            key={vendor._id}
            elevation={3}
            sx={{
              display: "flex",

              flexDirection: {
                xs: "row", // Mobile view
              },
              alignItems: "center",
              maxHeight: "160px",
              padding: "1rem",
              marginBottom: "1rem",
              width: "100%",
              minHeight: "120px",
              gap: "1rem",
            }}
          >
            {/* Store Logo */}
            <div className=" w-[40%] md:w-[20%] h-[120px] sm:h-full flex items-center justify-center">
              <img
                src={vendor.storeLogo}
                alt={vendor.storeName}
                className="w-full h-[120px] object-fill rounded-lg"
              />
            </div>

            {/* Store Info */}
            <div className="w-full sm:w-[40%] flex flex-col items-start gap-y-3">
              <h3 className="text-xl sm:text-2xl font-lisuBusa">
                {vendor.storeName}
              </h3>
              <h4 className="text-sm sm:text-base">
                Store Owner: {vendor.user?.name}
              </h4>
              <h4 className="text-sm sm:text-base text-red-600 font-semibold">
                Status: Rejected
              </h4>
            </div>
          </Paper>
        ))}
      </Container>
    </div>
  );
};

export default RejectedVendors;
