import {createAsyncThunk,createSlice} from '@reduxjs/toolkit'
import axios from 'axios';
const baseUrl = 'http://localhost:5001/api/buynowforme';
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData,{rejectWithValue}) => {
        try {
            let res = await axios.post(`${baseUrl}/create-order`, orderData,{
                headers: {
                    'Content-Type': 'application/json',
                    apikey: import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true
            })
            return res.data; // Assuming the response contains the created order data
        } catch (error) {
            console.error('Error creating order:', error);
            return rejectWithValue(error.response.data.message || 'Failed to create order');
        }
    }
)

export const getOrders = createAsyncThunk(
    'orders/getOrders',
    async (_,{rejectWithValue}) => {
        try {
            let res = await axios.get(`${baseUrl}/get-orders`,{
                headers: {
                    'Content-Type': 'application/json',
                    apikey: import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true
            })
            return res.data; // Assuming the response contains the list of orders
        } catch (error) {
            console.error('Error fetching orders:', error);
            return rejectWithValue(error.response.data.message || 'Failed to fetch orders');
        }
    }
)

export const getallOrders = createAsyncThunk(
    'orders/getallOrders',
    async (_,{rejectWithValue}) => {
        try {
            let res = await axios.get(`${baseUrl}/get-all-orders`,{
                headers: {
                    'Content-Type': 'application/json',
                    apikey: import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true
            })
            return res.data; // Assuming the response contains the list of orders
        } catch (error) {
            console.error('Error fetching orders:', error);
            return rejectWithValue(error.response.data.message || 'Failed to fetch orders');
        }
    }
)

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${baseUrl}/update-order-status/${orderId}`,
        { status }, // Changed to send as { status } instead of empty body
        {
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

export const createOrderForSomeone = createAsyncThunk(
    'order/createOrderForSomeone',
    async (orderData,{rejectWithValue}) => {
        try {
            let res = await axios.post(`${baseUrl}/create-order-someone`, orderData,{
                headers: {
                    'Content-Type': 'application/json',
                    "apikey": import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true
            })
            return res.data; // Assuming the response contains the created order data
        } catch (error) {
            console.error('Error creating order:', error);
            return rejectWithValue(error.response.data.message || 'Failed to create order');
        }
    }
)

export const rejectOrder = createAsyncThunk(
    'orders/reject',
    async (orderId, { rejectWithValue }) => {
        try {
            let res = await axios.delete(`${baseUrl}/delete-order/${orderId}`,{
                headers: {
                    'Content-Type': 'application/json',
                    apikey: import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true
            })
            return res.data; // Assuming the response contains the updated order data
        } catch (error) {
            console.error('Error rejecting order:', error);
            return rejectWithValue(error.response.data.message || 'Failed to reject order');
        }
    }
)

export const totalSalesAdmin = createAsyncThunk(
    'orders/totalSalesAdmin',
    async (_,{rejectWithValue}) => {
        try {
            let res = await axios.get(`${baseUrl}/total-sales-for-admin`,{
                headers: {
                    'Content-Type': 'application/json',
                    apikey: import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true
            })
            return res.data; // Assuming the response contains the list of orders
        } catch (error) {
            console.error('Error fetching orders:', error);
            return rejectWithValue(error.response.data.message || 'Failed to fetch orders');
        }
    }
)
export const adminMonthlyGraph = createAsyncThunk(
    'orders/adminMonthlyGraph',
    async (_,{rejectWithValue}) => {
           try {
           let res = await axios.get(`${baseUrl}/get-monthly-graph-admin`,{
               headers: {
                   'Content-Type': 'application/json',
                   apikey: import.meta.env.VITE_API_KEY,
                   Authorization: `Bearer ${localStorage.getItem('token')}`
               },
               withCredentials: true
           })
           return res.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            return rejectWithValue(error.response.data.message || 'Failed to fetch orders');
}
    
 }
)


let BuyNowForMeSlice = createSlice({
    name: 'buyNowForMe',
    initialState: {
        order: [],
        loading: false,
        error: null,
        total : null,
    },

    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getallOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getallOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.orders;
            })
            .addCase(getallOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(rejectOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rejectOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(rejectOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createOrderForSomeone.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrderForSomeone.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(createOrderForSomeone.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(totalSalesAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(totalSalesAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.total = action.payload;
            })
            .addCase(totalSalesAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(adminMonthlyGraph.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminMonthlyGraph.fulfilled, (state, action) => {
                state.loading = false;
                state.total = action.payload;
            })
            .addCase(adminMonthlyGraph.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
          
    }
})
export default BuyNowForMeSlice.reducer;