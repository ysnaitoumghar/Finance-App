import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as expenseService from '../../services/expenseService';

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async ({ userId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await expenseService.getExpenses(userId, startDate, endDate);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch expenses' });
    }
  }
);

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async ({ userId, expenseData }, { rejectWithValue }) => {
    try {
      const response = await expenseService.addExpense(userId, expenseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add expense' });
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ expenseId, expenseData }, { rejectWithValue }) => {
    try {
      const response = await expenseService.updateExpense(expenseId, expenseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update expense' });
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (expenseId, { rejectWithValue }) => {
    try {
      await expenseService.deleteExpense(expenseId);
      return expenseId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete expense' });
    }
  }
);

export const fetchExpenseAnalytics = createAsyncThunk(
  'expenses/fetchAnalytics',
  async ({ userId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await expenseService.getExpenseAnalytics(userId, startDate, endDate);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch analytics' });
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    analytics: null,
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch expenses';
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(e => e.id !== action.payload);
      })
      .addCase(fetchExpenseAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  }
});

export default expenseSlice.reducer;
