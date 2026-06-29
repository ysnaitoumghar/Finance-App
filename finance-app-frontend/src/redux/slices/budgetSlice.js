import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as budgetService from '../../services/budgetService';

export const fetchBudgets = createAsyncThunk(
  'budgets/fetchBudgets',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await budgetService.getBudgets(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch budgets' });
    }
  }
);

export const addBudget = createAsyncThunk(
  'budgets/addBudget',
  async ({ userId, budgetData }, { rejectWithValue }) => {
    try {
      const response = await budgetService.createBudget(userId, budgetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add budget' });
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budgets/updateBudget',
  async ({ budgetId, budgetData }, { rejectWithValue }) => {
    try {
      const response = await budgetService.updateBudget(budgetId, budgetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update budget' });
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (budgetId, { rejectWithValue }) => {
    try {
      await budgetService.deleteBudget(budgetId);
      return budgetId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete budget' });
    }
  }
);

const budgetSlice = createSlice({
  name: 'budgets',
  initialState: {
    budgets: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch budgets';
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.budgets.push(action.payload);
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        const index = state.budgets.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter(b => b.id !== action.payload);
      });
  }
});

export default budgetSlice.reducer;
