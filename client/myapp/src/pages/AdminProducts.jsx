import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addDiscount,
  finishDiscount,
  deleteProduct,
  makeProductInactive,
  makeProductactive,
  getAllProductsAdmin,
  searchProducts,   // ✅ searchProducts import
} from "../features/ProductFeatures";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  LocalOffer as DiscountIcon,
  AddCircle as AddDiscountIcon,
  CheckCircle as ActiveIcon,
} from "@mui/icons-material";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) =>
    Array.isArray(state.product.list) ? state.product.list : []
  );
  const { status, error } = useSelector((state) => state.product);

  const [limit] = useState(200);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ search query state

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      // ✅ agar search ho raha hai toh searchProducts call hoga
      dispatch(searchProducts({ query: searchQuery, limit, page }));
    } else {
      // ✅ normal fetch jab search empty ho
      dispatch(getAllProductsAdmin({ limit, page }));
    }
  }, [dispatch, limit, page, searchQuery]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // 🔹 Add Discount Handler
  const handleAddDiscount = (product) => {
    const discount = window.prompt(
      `Enter discount price for "${product.name}" (current: $${product.price}):`
    );
    if (discount && !isNaN(discount)) {
      dispatch(addDiscount({ id: product._id, discountPrice: discount }))
        .unwrap()
        .then(() => {
          dispatch(getAllProductsAdmin({ limit, page }));
        });
    }
  };

  // 🔹 Finish Discount Handler
  const handleFinishDiscount = (id) => {
    dispatch(finishDiscount(id))
      .unwrap()
      .then(() => {
        dispatch(getAllProductsAdmin({ limit, page }));
      });
  };

  // 🔹 Delete Product
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id))
        .unwrap()
        .then(() => {
          dispatch(getAllProductsAdmin({ limit, page }));
        });
    }
  };

  // 🔹 Toggle Active / Inactive
  const handleToggleActive = (product) => {
    if (product.isActive) {
      dispatch(makeProductInactive(product._id))
        .unwrap()
        .then(() => {
          dispatch(getAllProductsAdmin({ limit, page }));
        });
    } else {
      dispatch(makeProductactive(product._id))
        .unwrap()
        .then(() => {
          dispatch(getAllProductsAdmin({ limit, page }));
        });
    }
  };

  // 🔹 Helper function to truncate long text
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <Container maxWidth="xl" className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Products</h1>

      {status === "loading" && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* 🔹 Search Input */}
      <form
        className="w-full h-14 flex items-center justify-end mb-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="search"></label>
        <input
          type="text"
          name="search"
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // ✅ update searchQuery
          className="w-full md:w-[30%] h-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search here"
        />
      </form>

      <TableContainer component={Paper} className="shadow-md rounded-lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>User</b>
              </TableCell>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Price</b>
              </TableCell>
              <TableCell>
                <b>Discount</b>
              </TableCell>
              <TableCell>
                <b>Category</b>
              </TableCell>
              <TableCell>
                <b>Stock</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
              <TableCell>
                <b>Created At</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.userId?.name || "N/A"}</TableCell>
                <TableCell>{truncateText(product.name, 120)}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  {product.discountPrice > 0 ? `$${product.discountPrice}` : "-"}
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  {product.isActive ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(product.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Tooltip title="Delete">
                    <IconButton
                      type="button"
                      color="error"
                      onClick={() => handleDelete(product._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>

                  {product.isActive ? (
                    <Tooltip title="Make Inactive">
                      <IconButton
                        type="button"
                        color="warning"
                        onClick={() => handleToggleActive(product)}
                      >
                        <BlockIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Make Active">
                      <IconButton
                        type="button"
                        color="success"
                        onClick={() => handleToggleActive(product)}
                      >
                        <ActiveIcon />
                      </IconButton>
                    </Tooltip>
                  )}

                  {product.discountPrice > 0 ? (
                    <Tooltip title="Finish Discount">
                      <IconButton
                        type="button"
                        color="secondary"
                        onClick={() => handleFinishDiscount(product._id)}
                      >
                        <DiscountIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Add Discount">
                      <IconButton
                        type="button"
                        color="success"
                        onClick={() => handleAddDiscount(product)}
                      >
                        <AddDiscountIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Load More Button */}
      {products.length === limit * page && (
        <div className="flex justify-center mt-4">
          <Button type="button" variant="contained" onClick={handleLoadMore}>
            Load More
          </Button>
        </div>
      )}
    </Container>
  );
};

export default AdminProducts;
