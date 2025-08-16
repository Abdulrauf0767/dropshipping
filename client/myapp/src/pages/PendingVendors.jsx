// PendingVendors.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pendingVendors } from "../features/VendorFeatures";
import { Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const PendingVendors = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.vendor);

  useEffect(() => {
    if (status === "idle") {
      dispatch(pendingVendors()).unwrap().then(() => {
        dispatch(pendingVendors());
      }).catch ((error) => {
        alert(error.message);
      })
    }
  }, [dispatch, status]);

  return (
    <div className="w-[95%] mx-auto py-6">
      {status === "loading" && <p className="text-center">Loading...</p>}
      {status === "failed" && <p className="text-red-500">{error}</p>}

      {list.length > 0 ? (
        list.map((vendor) => (
            <Link to={`/admin/pending-vendors/${vendor._id}`} >
          <Paper
            key={vendor._id}
            elevation={3}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "1rem",
              marginBottom: "1rem",
              xs : {
                  height : '120px'
              },
              width : "100%"
            }}
          >
            <div className="w-[20%] h-full " >
              <img
                src={vendor.storeLogo}
                alt={vendor.name}
                className="w-full h-full object-fill rounded-md "
              />
            </div>
            <div className="md:w-[30%] w-[60%]  h-full ml-5 " >
               <h3  className="md:text-lg text-xs font-bold capitalize " > Store Owner :  {vendor.user.name}</h3> 
               <h4 className=" capitalize text-xs md:text-lg " > Store Name :  {vendor.storeName}</h4> 
               <h4 className=" capitalize text-xs md:text-lg " > Phone Number :  {vendor.phoneNumber}</h4> 
            </div>
            <div className="md:w-[40%] w-[10%] flex items-center justify-end h-full ml-5 " >
               <span className="text-white bg-green-500 px-2 py-2 rounded-3xl" >pending</span> 
            </div>
            
          </Paper>
        </Link>
        ))
      ) : (
        status === "succeeded" && (
          <p className="text-center text-gray-500">
            No pending vendors found.
          </p>
        )
      )}
    </div>
  );
};

export default PendingVendors;
