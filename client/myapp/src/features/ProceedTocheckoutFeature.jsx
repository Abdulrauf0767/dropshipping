import {createAsyncThunk,createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
const BaseURL = 'http://localhost:5001/api/proceedtocheckout';

export const addProductForme = createAsyncThunk(
    'checkout/addProduct',
    async (productData,{rejectWithValue}) => {
        try {
            let res = await axios.post(`${BaseURL}/add-product-me`,productData,{
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

export const addProductFormSomeone = createAsyncThunk(
    'checkout/addProductSomeone',
    async (productData,{rejectWithValue}) => {
        try {
            let res = await axios.post(`${BaseURL}/add-product-someone`,productData,{
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

export const userOrder = createAsyncThunk(
    'user/orders',
    async (_,{rejectWithValue}) => {
        try {
            let res = await axios.get(`${BaseURL}/user-order`,{
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

export const allOrders = createAsyncThunk(
    'all/orders',
    async (_,{rejectWithValue}) => {
        try {
            let res = await axios.get(`${BaseURL}/all-order`,{
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

export const updateStatus = createAsyncThunk(
    'update/order status',
    async (id,{rejectWithValue}) => {
        let res = await axios.patch(`${BaseURL}/update-status/${id}`,{},{
            headers: {
                'Content-Type': 'application/json',
                apikey: import.meta.env.VITE_API_KEY,
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        })
    }
)

export const rejectOrder = createAsyncThunk(
    'reject/order',
    async (id,{rejectWithValue}) => {
        let res = await axios.patch(`${BaseURL}/reject-order/${id}`,{
            headers: {
                'Content-Type': 'application/json',
                apikey: import.meta.env.VITE_API_KEY,
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        })
    }
)

export const proceedToCheckoutSlice = createSlice({
    name:'proceedToCheckout',
    initialState:{
        list : [],
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
        .addCase(addProductForme.pending,(state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addProductForme.fulfilled,(state,action) => {
            state.loading = false;
            state.list = action.payload;
        })
        .addCase(addProductForme.rejected,(state,action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(addProductFormSomeone.pending,(state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addProductFormSomeone.fulfilled,(state,action) => {
            state.loading = false;
            state.list = action.payload;
        })
        .addCase(addProductFormSomeone.rejected,(state,action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(userOrder.pending,(state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(userOrder.fulfilled,(state,action) => {
            state.loading = false;
            state.list = action.payload;
        })
        .addCase(userOrder.rejected,(state,action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(allOrders.pending,(state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(allOrders.fulfilled,(state,action) => {
            state.loading = false;
            state.list = action.payload;
        })
        .addCase(allOrders.rejected,(state,action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateStatus.pending,(state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateStatus.fulfilled,(state,action) => {
            state.loading = false;
            state.list = action.payload;
        })
        .addCase(updateStatus.rejected,(state,action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(rejectOrder.pending,(state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(rejectOrder.fulfilled,(state,action) => {
            state.loading = false;
            state.list = action.payload;
        })
        .addCase(rejectOrder.rejected,(state,action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default proceedToCheckoutSlice.reducer