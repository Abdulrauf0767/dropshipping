import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const baseurl = 'http://localhost:5001/api/contact';
export const createContact = createAsyncThunk(
    'contact/createContact',
    async (contactData,{rejectWithValue}) => {
        try {
            let res = await axios.post(`${baseurl}/add`, contactData,{
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

export const getMessages = createAsyncThunk(
    'contact/getMessages',
    async(_,{rejectWithValue}) => {
        try {
            let res = await axios.get(`${baseurl}/all`,{
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

export const deleteMessage = createAsyncThunk(
    'contact/deleteMessage',
    async (id,{rejectWithValue}) => {
        try {
            let res = await axios.delete(`${baseurl}/remove/${id}`,{
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

const contactSlice = createSlice({
    name :'contact',
    initialState : {
        contact : [],
        loading : false,
        error : null
    },
    extraReducers : (builder) => {
        builder.addCase(createContact.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createContact.fulfilled, (state, action) => {
            state.loading = false;
            state.contact = action.payload;
        });
        builder.addCase(createContact.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(getMessages.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getMessages.fulfilled, (state, action) => {
            state.loading = false;
            state.contact = action.payload;
        });
        builder.addCase(getMessages.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(deleteMessage.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteMessage.fulfilled, (state, action) => {
            state.loading = false;
            state.contact = action.payload;
        });
        builder.addCase(deleteMessage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
})

export default contactSlice.reducer