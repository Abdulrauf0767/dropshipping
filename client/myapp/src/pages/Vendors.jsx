import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allVendors, blockVendor, deleteVendor, searchVendor } from "../features/VendorFeatures";
import { Button, Container, Paper } from "@mui/material";

const Vendors = () => {
    const [search,setSearch] = useState('');
  const dispatch = useDispatch();
  const vendorList = useSelector((state) => state.vendor.list);
  const { status } = useSelector((state) => state.vendor);

  useEffect(() => {
    if (status === "idle") {
      dispatch(allVendors());
    }
  }, [status, dispatch]);

const handleSearch = (e) => {
  setSearch(e.target.value); // state update
  dispatch(searchVendor({ query: e.target.value })); // thunk call
};

 const handleBlock = (id) => {
  dispatch(blockVendor(id))
    .unwrap()
    .then(() => {
      dispatch(allVendors());
    })
    .catch((error) => {
      alert(error.message);
    });
};
const handleDelete = (id) => {
  dispatch(deleteVendor(id))
    .unwrap()
    .then(() => {
      dispatch(allVendors());
    })
    .catch((error) => {
      alert(error.message);
    });
};

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
        }}
      >
        <form className="w-full flex items-center justify-end h-14 " >
        <label htmlFor="search"></label>
        <input onChange={handleSearch} value={search} type="search" name="search" id="search" placeholder="Search Here" className=" w-full md:w-[30%] h-10 border-2 border-gray-300 rounded-md p-3 "   />
        </form>
        {vendorList.map((vendor) => (
          <Paper
            key={vendor._id}
            elevation={3}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row", // ✅ force row always
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
              marginBottom: "1rem",
              gap: "1rem",
              flexWrap: "wrap", // ✅ in case space chhoti ho
              height: "auto",
            }}
          >
            {/* Image Section */}
            <div className="flex-shrink-0 w-[100px] sm:w-[150px] flex items-center justify-center">
              <img
                src={vendor.storeLogo}
                alt={vendor.storeName}
                className="w-full max-h-[100px] sm:max-h-[140px] object-contain rounded-lg"
              />
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-center flex-1 gap-y-2 text-left">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold font-lisuBusa">
                {vendor.storeName}
              </h3>
              <p className="text-xs sm:text-sm md:text-lg font-lisuBusa text-gray-600 truncate line-clamp-2 ">
                {vendor.storeDescription}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 flex-wrap">
              <Button onClick={() => handleBlock(vendor._id)}  variant="contained" color="success" size="small">
                Block
              </Button>
              <Button onClick={() => handleDelete(vendor._id)} variant="contained" color="error" size="small">
                Delete
              </Button>
            </div>
          </Paper>
        ))}
      </Container>
    </div>
  );
};

export default Vendors;
