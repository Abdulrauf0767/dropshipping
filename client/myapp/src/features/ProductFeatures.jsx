// productSlice.js (Redux slice - keep as is)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadProduct = createAsyncThunk(
  'product/uploadProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:5001/api/product/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "apikey": import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      // Return a rejected action with error message
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllProducts = createAsyncThunk(
    'allproducts/products',
    async ({limit = 50, page = 1 , },{rejectWithValue}) => {
        try {
            const  res = await axios.get(`http://localhost:5001/api/product/all?limit=${limit}&page=${page}`,{
                headers : {
                    "Content-Type" : "application/json",
                    "apikey" : import.meta.env.VITE_API_KEY,
                    Authorization : `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials : true
            })
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const searchProducts = createAsyncThunk(
  'search/products',
  async({query, limit = 50, page = 1}, {rejectWithValue}) => {
    try {
        const  res = await axios.get(`http://localhost:5001/api/product/search?query=${query}&limit=${limit}&page=${page}`,{
            headers : {
                "Content-Type" : "application/json",
                "apikey" : import.meta.env.VITE_API_KEY,
                Authorization : `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials : true
        })
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)

export const searchProductsByCategory = createAsyncThunk(
  'search/productbycategory',
  async ({category, limit = 50, page = 1}, {rejectWithValue}) => {
    try {
        const  res = await axios.get(`http://localhost:5001/api/product/category?category=${category}&limit=${limit}&page=${page}`,{
            headers : {
                "Content-Type" : "application/json",
                "apikey" : import.meta.env.VITE_API_KEY,
                Authorization : `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials : true
        })
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)

export const getAllCategories = createAsyncThunk(
  'allcategories/categories',
  async (_, {rejectWithValue}) => {
    try {
        const res = await axios.get('http://localhost:5001/api/product/all-category', {
            headers: {
                "Content-Type": "application/json",
                "apikey": import.meta.env.VITE_API_KEY,
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)

export const getAllProductsAdmin = createAsyncThunk(
  'allproducts/productsadmin',
  async ({limit = 200, page = 1}, {rejectWithValue}) => {
    try {
        const res = await axios.get(`http://localhost:5001/api/product/all-product?limit=${limit}&page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                "apikey": import.meta.env.VITE_API_KEY,
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        return res.data.products;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)

export const productByUser = createAsyncThunk(
  'user/all products',
  async ({limit = 200, page = 1}, {rejectWithValue}) => {
    try {
        const res = await axios.get(`http://localhost:5001/api/product/user-product?limit=${limit}&page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                "apikey": import.meta.env.VITE_API_KEY,
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        return res.data.products;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)


const ProductSlice = createSlice({
  name: 'product',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list.push(action.payload);
      })
      .addCase(uploadProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(getAllProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.products;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(searchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.products;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(searchProductsByCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchProductsByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.products;
      })
      .addCase(searchProductsByCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(getAllCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.categories;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(getAllProductsAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAllProductsAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(getAllProductsAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(productByUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(productByUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(productByUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default ProductSlice.reducer;
