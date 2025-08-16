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
let BuyNowForMeSlice = createSlice({
    name: 'buyNowForMe',
    initialState: {
        order: [],
        loading: false,
        error: null
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
          
    }
})
export default BuyNowForMeSlice.reducer;