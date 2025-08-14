import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BaseUrl = "http://localhost:5001/api/cart";

// Add product (with quantity support)
export const addProductToCart = createAsyncThunk(
  "cart/addProducts",
  async (payload, { rejectWithValue }) => {
    // payload can be productId string OR { productId, quantity }
    const { productId, quantity } =
      typeof payload === "string"
        ? { productId: payload, quantity: 1 }
        : payload;

    try {
      const res = await axios.post(
        `${BaseUrl}/add/${productId}`,
        { quantity },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      return res.data; // API returns full cart with products array
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

// Get full cart
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BaseUrl}/all`, {
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

// Remove product from cart
export const removeProductFromCart = createAsyncThunk(
  "cart/removeProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${BaseUrl}/remove/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

// Update quantity of product in cart
export const updateProductQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BaseUrl}/update/${productId}`,
        { quantity },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      return res.data; // updated cart object
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

const CartSlice = createSlice({
  name: "cart",
  initialState: {
    list: [], // array of cart products with quantity and product info
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add product
      .addCase(addProductToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.cart.products || action.payload.products; 
        // Some APIs respond with cart or products directly; adjust accordingly
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Get cart
      .addCase(getCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.cart?.products || action.payload.products;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Remove product
      .addCase(removeProductFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeProductFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.cart?.products || action.payload.products;
      })
      .addCase(removeProductFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update quantity
      .addCase(updateProductQuantity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProductQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.cart?.products || action.payload.products;
      })
      .addCase(updateProductQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default CartSlice.reducer;
