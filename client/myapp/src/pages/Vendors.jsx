import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  allVendors,
  blockVendor,
  deleteVendor,
  searchVendor,
} from "../features/VendorFeatures";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const Vendors = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const vendorList = useSelector((state) =>
    Array.isArray(state.vendor.list) ? state.vendor.list : []
  );
  const { status } = useSelector((state) => state.vendor);

  useEffect(() => {
    if (status === "idle") {
      dispatch(allVendors());
    }
  }, [status, dispatch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchVendor({ query: e.target.value }));
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

  // ✅ Function to truncate description to 100 words
  const truncateDescription = (text, wordLimit = 100) => {
    if (!text) return "N/A";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <Container maxWidth="xl" sx={{ display: "flex", flexDirection: "column", padding: "1rem" }}>
        
        {/* Search Bar */}
        <form className="w-full flex items-center justify-end h-14 mb-4">
          <label htmlFor="search"></label>
          <input
            onChange={handleSearch}
            value={search}
            type="search"
            name="search"
            id="search"
            placeholder="Search Here"
            className="w-full md:w-[30%] h-10 border-2 border-gray-300 rounded-md p-3"
          />
        </form>

        {/* Vendors Table */}
        <TableContainer component={Paper} className="shadow-md rounded-lg">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Logo</b></TableCell>
                <TableCell><b>Store Name</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Owner</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Phone</b></TableCell>
                <TableCell><b>City</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {vendorList.map((vendor) => (
                <TableRow key={vendor._id}>
                  <TableCell>
                    <img
                      src={vendor.storeLogo}
                      alt={vendor.storeName}
                      className="w-20 h-20 object-contain rounded-md"
                    />
                  </TableCell>
                  <TableCell>{vendor.storeName}</TableCell>
                  <TableCell>
                    {truncateDescription(vendor.storeDescription)}
                  </TableCell>
                  <TableCell>{vendor.user?.name || "N/A"}</TableCell>
                  <TableCell>{vendor.user?.email || "N/A"}</TableCell>
                  <TableCell>{vendor.phoneNumber || "N/A"}</TableCell>
                  <TableCell>{vendor.city}</TableCell>
                  <TableCell>
                    {vendor.isBlocked ? (
                      <span className="text-red-600 font-medium">Blocked</span>
                    ) : (
                      <span className="text-green-600 font-medium">Active</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleBlock(vendor._id)}
                        variant="contained"
                        color="success"
                        size="small"
                      >
                        Block
                      </Button>
                      <Button
                        onClick={() => handleDelete(vendor._id)}
                        variant="contained"
                        color="error"
                        size="small"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default Vendors;
