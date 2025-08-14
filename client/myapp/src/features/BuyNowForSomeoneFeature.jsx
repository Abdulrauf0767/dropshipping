import {createAsyncThunk,createSlice} from '@reduxjs/toolkit'
import axios from 'axios';
const baseUrl = 'http://localhost:5001/api/buynowforsomeone';
export const createOrderSomeone = createAsyncThunk(
    'order/createOrderSomeone',
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

export const getOrdersSomeone = createAsyncThunk(
    'orders/getOrdersSomeone',
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

let BuyNowForSomeoneSlice = createSlice({
    name: 'buyNowForsomeone',
    initialState: {
        order: [],
        loading: false,
        error: null
    },

    extraReducers: (builder) => {
        builder
            .addCase(createOrderSomeone.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrderSomeone.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(createOrderSomeone.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getOrdersSomeone.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrdersSomeone.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(getOrdersSomeone.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})
export default BuyNowForSomeoneSlice.reducer;