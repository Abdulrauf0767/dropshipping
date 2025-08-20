import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
const baseUrl = 'http://localhost:5001/api/digi'
// Thunk for fetching cities
export const getCities = createAsyncThunk(
  'digiDokan/getCities',
  async (_, { rejectWithValue }) => {
    try {
      let res = await axios.get(
        `${baseUrl}/get/cities`,
        {
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const digiDokanSlice = createSlice({
  name: 'digiDokan',
  initialState: {
    cities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCities.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCities.fulfilled, (state, action) => {
        state.loading = false
        state.cities = action.payload
      })
      .addCase(getCities.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default digiDokanSlice.reducer
