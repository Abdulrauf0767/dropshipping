import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BaseUrl = 'http://localhost:5001/api/withdraw';

// Create withdraw
export const createWithdraw = createAsyncThunk(
  'withdraw/createWithdraw',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BaseUrl}/create-withdraw`, data, {
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Something went wrong");
    }
  }
);

// Get all pending withdraws
export const pendingWithdraw = createAsyncThunk(
  'withdraw/pendingWithdraw',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BaseUrl}/all-pending`, {
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      // ✅ Fix: backend kabhi {message: "..."} bhejta hai, kabhi {data: [...]}
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      } else {
        return []; // agar data nahi mila to empty array
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch pending withdraws");
    }
  }
);

// Approve withdraw
export const approveWithdraw = createAsyncThunk(
  'withdraw/approveWithdraw',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${BaseUrl}/approve-withdraw/${id}`, {}, {
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      return { id, data: res.data };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to approve withdraw");
    }
  }
);

// Reject withdraw
export const rejectWithdraw = createAsyncThunk(
  'withdraw/rejectWithdraw',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${BaseUrl}/reject-withdraw/${id}`, {}, {
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      return { id, data: res.data };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to reject withdraw");
    }
  }
);

const WithdrawSlice = createSlice({
  name: "withdraw",
  initialState: {
    list: [],
    status: 'idle',
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create withdraw
      .addCase(createWithdraw.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createWithdraw.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list.push(action.payload);
      })
      .addCase(createWithdraw.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Get pending withdraws
      .addCase(pendingWithdraw.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(pendingWithdraw.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload; // ✅ array milega ya empty []
      })
      .addCase(pendingWithdraw.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.list = []; // error pe list clear
      })

      // Approve withdraw
      .addCase(approveWithdraw.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = state.list.filter(item => item._id !== action.payload.id);
      })

      // Reject withdraw
      .addCase(rejectWithdraw.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = state.list.filter(item => item._id !== action.payload.id);
      });
  },
});

export default WithdrawSlice.reducer;
