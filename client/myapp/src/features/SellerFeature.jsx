import {createAsyncThunk,createSlice} from '@reduxjs/toolkit'
import axios from 'axios'
export const addSeller = createAsyncThunk(
  'seller/addSeller',
  async (sellerData,{rejectWithValue}) => {
      try {
    let res = await axios.post('http://localhost:5001/api/seller/create-seller', sellerData, { 
        headers: {
          'Content-Type': 'application/json',
          "apikey": import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
    })   
        return res.data
      } catch (error) {
        return rejectWithValue(error.response.data)
      }
  })

 export const getSeller = createAsyncThunk(
    'seller/getseller',
    async(_,{rejectWithValue}) => {
        try {
            let res = await axios.get('http://localhost:5001/api/seller/get-seller', {
                headers: {
                    'Content-Type': 'application/json',
                    "apikey": import.meta.env.VITE_API_KEY,
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true
            })
            return res.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
 ) 

const sellerSlice = createSlice({
    name: 'seller',
    initialState: {
        seller: [],
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(addSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSeller.fulfilled, (state, action) => {
                state.loading = false;
                state.seller = action.payload;
            })
            .addCase(addSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSeller.fulfilled, (state, action) => {
                state.loading = false;
                state.seller = action.payload;
            })
            .addCase(getSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})
export default sellerSlice.reducer
    