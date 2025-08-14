import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const signUp = createAsyncThunk('/signup', async (data) => {
    const res = await axios.post('http://localhost:5001/api/user/register', data, {
        headers: { // ✅ lowercase
            'Content-Type': 'application/json',
            "apikey": import.meta.env.VITE_API_KEY
        },
        withCredentials: true
    });
    localStorage.setItem('token', res.data.token); // ✅ return se pehle
    return res.data;
});

export const login = createAsyncThunk('/login', async (data) => {
    const res = await axios.post('http://localhost:5001/api/user/login', data, {
        headers: { // ✅ lowercase
            'Content-Type': 'application/json',
            "apikey": import.meta.env.VITE_API_KEY
        },
        withCredentials: true
    });

    // ✅ Token ko as string save karo, JSON.parse mat karo
    localStorage.setItem('token', res.data.token);
    return res.data;
});

export const logout = createAsyncThunk('/logout', async () => {
    const res = await axios.get('http://localhost:5001/api/user/logout', {
        headers: { // ✅ lowercase
            'Content-Type': 'application/json',
             "apikey": import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
    });
    localStorage.removeItem('token'); // ✅ token clear on logout
    return res.data;
});

export const userGetRole = createAsyncThunk('/user/role', async () => {
    const res = await axios.get('http://localhost:5001/api/user/auth/me', {
        headers: { // ✅ lowercase
            'Content-Type': 'application/json',
            "apikey": import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
    });
    return res.data;
});

export const updateProfile = createAsyncThunk('/user/update', async (data) => {
    const res = await axios.patch('http://localhost:5001/api/profile/update', data, {
        headers: { // ✅ lowercase
            'Content-Type': 'multipart/form-data',
            "apikey": import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
    });
    return res.data;
});

export const getUserProfile = createAsyncThunk('/user/profile', async () => {
    const res = await axios.get('http://localhost:5001/api/profile/get', {
        headers: { // ✅ lowercase
            'Content-Type': 'application/json',
            "apikey": import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
    });
    return res.data;
});

export const allUsers = createAsyncThunk(
    'users/all users',
    async (_,{rejectWithValue}) => {
        try {
            let res = await axios.get('http://localhost:5001/api/user/all',{
                headers : {
                    "Content-Type" : "application/json",
                    "apikey" : import.meta.env.VITE_API_KEY,
                    Authorization : `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials : true
            })
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const UserSlice = createSlice({
    name: 'user',
    initialState: {
        status: 'idle',
        user: null,
        error: '',
        profile : [],
        alluser :[]
    },
    extraReducers: (builder) => {
        builder
            .addCase(signUp.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(logout.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logout.fulfilled, (state) => {
                state.status = 'succeeded';
                state.user = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(userGetRole.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(userGetRole.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(userGetRole.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(allUsers.pending,(state,action) => {
                state.status = 'loading';
            })
            .addCase(allUsers.fulfilled,(state,action) => {
                state.status = 'succeeded';
                state.alluser = action.payload.users;
            })
            .addCase(allUsers.rejected,(state,action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
});

export default UserSlice.reducer;
