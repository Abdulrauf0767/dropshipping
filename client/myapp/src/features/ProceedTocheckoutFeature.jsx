import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
const BaseURL = 'http://localhost:5001/api/proceedtocheckout';

export const addProductForme = createAsyncThunk(
  'checkout/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BaseURL}/add-product-me`, productData, {
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error('Error creating order:', error);
      return rejectWithValue(error?.response?.data?.message || 'Failed to create order');
    }
  }
);

export const addProductFormSomeone = createAsyncThunk(
  'checkout/addProductSomeone',
  async (productData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BaseURL}/add-product-someone`, productData, {
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error('Error creating order:', error);
      return rejectWithValue(error?.response?.data?.message || 'Failed to create order');
    }
  }
);

export const userOrder = createAsyncThunk(
  'user/orders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BaseURL}/user-order`, {
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      return res.data; // shape: { message, orders: [...] }
    } catch (error) {
      console.error('Error fetching orders:', error);
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const allOrders = createAsyncThunk(
  'all/orders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BaseURL}/all-order`, {
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      return res.data; // shape: [...]  (array)
    } catch (error) {
      console.error('Error fetching orders:', error);
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

/**
 * ✅ FIX: status body send karein, aur updated order return karein
 * Backend response assum: { message, order }
 */
export const updateStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${BaseURL}/update-status/${orderId}`,
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      );
      return res.data.order; // return the updated order document
    } catch (error) {
      console.error('Error updating order status:', error);
      return rejectWithValue(error?.response?.data?.message || 'Failed to update status');
    }
  }
);

/**
 * ✅ FIX: DELETE call sahi tariqe se, aur reducer ko orderId mile taake list se remove kar saken
 */
export const rejectOrder = createAsyncThunk(
  'orders/reject',
  async (orderId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BaseURL}/reject-order/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      return { orderId };
    } catch (error) {
      console.error('Error rejecting order:', error);
      return rejectWithValue(error?.response?.data?.message || 'Failed to reject order');
    }
  }
);

const replaceOrderInArray = (arr, updated) =>
  Array.isArray(arr) ? arr.map((o) => (o?._id === updated?._id ? updated : o)) : arr;

const removeOrderFromArray = (arr, id) =>
  Array.isArray(arr) ? arr.filter((o) => o?._id !== id) : arr;

export const proceedToCheckoutSlice = createSlice({
  name: 'proceedToCheckout',
  initialState: {
    list: [], // could be array OR { message, orders: [...] }
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // addProductForMe
      .addCase(addProductForme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductForme.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(addProductForme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addProductFormSomeone
      .addCase(addProductFormSomeone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductFormSomeone.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(addProductFormSomeone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // userOrder -> list shape: {message, orders: [...]}
      .addCase(userOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(userOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // allOrders -> list shape: [...]
      .addCase(allOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(allOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ updateStatus: update in-place for both shapes
      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;

        if (Array.isArray(state.list)) {
          // shape from allOrders
          state.list = replaceOrderInArray(state.list, updatedOrder);
        } else if (state.list && Array.isArray(state.list.orders)) {
          // shape from userOrder
          state.list = {
            ...state.list,
            orders: replaceOrderInArray(state.list.orders, updatedOrder),
          };
        }
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ rejectOrder: remove from list for both shapes
      .addCase(rejectOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectOrder.fulfilled, (state, action) => {
        state.loading = false;
        const { orderId } = action.payload;

        if (Array.isArray(state.list)) {
          state.list = removeOrderFromArray(state.list, orderId);
        } else if (state.list && Array.isArray(state.list.orders)) {
          state.list = {
            ...state.list,
            orders: removeOrderFromArray(state.list.orders, orderId),
          };
        }
      })
      .addCase(rejectOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default proceedToCheckoutSlice.reducer;
