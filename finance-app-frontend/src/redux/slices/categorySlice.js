import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as categoryService from '../../services/categoryService';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async ({ userId, type }, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategories(userId, type);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch categories' });
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async ({ userId, categoryData }, { rejectWithValue }) => {
    try {
      const response = await categoryService.addCategory(userId, categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add category' });
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch categories';
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      });
  }
});

export default categorySlice.reducer;
