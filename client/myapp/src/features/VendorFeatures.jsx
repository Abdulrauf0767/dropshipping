import {createAsyncThunk,createSlice} from '@reduxjs/toolkit';

import axios from 'axios';
const baseUrl = 'http://localhost:5001/api/vendor';
export const becomeVendor = createAsyncThunk(
    'vendor/becomeVendor',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${baseUrl}/become-vendor`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "apikey": import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    })

export const allVendors = createAsyncThunk(
    'vendor/allVendors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${baseUrl}/all-vendors`, {
                headers: {
                    "apikey": import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    })

export const specificVendor = createAsyncThunk(
    'vendor/specificVendor',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${baseUrl}/vendor/${id}`, {
                headers: {
                    "apikey": import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    } )
    
export const updateVendor = createAsyncThunk(
    'vendor/updateVendor',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${baseUrl}/update-vendor/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "apikey": import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });

export const deleteVendor = createAsyncThunk(
    'vendor/deleteVendor',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${baseUrl}/delete-vendor/${id}`, {
                headers: {
                    "apikey": import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    })
    
export const verifyVendor = createAsyncThunk(
    'vendor/verifyVendor',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${baseUrl}/verify-vendor/${id}`, {}, {
                headers: {
                    "apikey": import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    } )

export const blockVendor = createAsyncThunk(
    'vendor/blockVendor',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${baseUrl}/block-vendor/${id}`, {}, {
                headers: {
                    "apikey": import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    } )

export const unBlockVendor = createAsyncThunk(
    'vendor/unBlockVendor',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${baseUrl}/unblock-vendor/${id}`, {}, {
                headers: {
                    "apikey": import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const pendingVendors = createAsyncThunk(
    'vendor/pendingVendors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${baseUrl}/pending-vendors`, {
                headers: {
                    "apikey": import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

const vendorSlice = createSlice({
    name: 'vendor',
    initialState: {
        list: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(becomeVendor.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(becomeVendor.fulfilled, (state, action) => {
            state.loading = false;
            state.vendor = action.payload;
        })
        .addCase(becomeVendor.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(allVendors.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(allVendors.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload;
        })
        .addCase(allVendors.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(specificVendor.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(specificVendor.fulfilled, (state, action) => {
            state.loading = false;
            state.vendor = action.payload;
        })
        .addCase(specificVendor.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateVendor.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateVendor.fulfilled, (state, action) => {
            state.loading = false;
            state.vendor = action.payload;
        })
        .addCase(updateVendor.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(deleteVendor.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteVendor.fulfilled, (state, action) => {
            state.loading = false;
            state.vendor = action.payload;
        })
        .addCase(deleteVendor.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(verifyVendor.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(verifyVendor.fulfilled, (state, action) => {
            state.loading = false;
            state.vendor = action.payload;
        })
        .addCase(verifyVendor.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(blockVendor.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(blockVendor.fulfilled, (state, action) => {
            state.loading = false;
            state.vendor = action.payload;
        })
        .addCase(blockVendor.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(unBlockVendor.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(unBlockVendor.fulfilled, (state, action) => {
            state.loading = false;
            state.vendor = action.payload;
        })
        .addCase(unBlockVendor.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(pendingVendors.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(pendingVendors.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload.vendors;
        })
        .addCase(pendingVendors.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default vendorSlice.reducer
