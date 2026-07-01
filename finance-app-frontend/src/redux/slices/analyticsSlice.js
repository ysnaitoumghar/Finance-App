import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../../services/analyticsService';

const initialState = {
  analyticsData: {
    summary: null,
    recentTransactions: [],
    categoryBreakdown: [],
    monthlyTrends: [],
  },
  loading: false,
  analyticsError: null,
  dateRange: {
    startDate: null,
    endDate: null,
    label: 'This Month',
  },
};

export const fetchAllAnalytics = createAsyncThunk(
  'analytics/fetchAllAnalytics',
  async ({ userId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getAllAnalytics(userId, startDate, endDate);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics data');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    clearAnalyticsError: (state) => {
      state.analyticsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAnalytics.pending, (state) => {
        state.loading = true;
        state.analyticsError = null;
      })
      .addCase(fetchAllAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsData = action.payload;
      })
      .addCase(fetchAllAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.analyticsError = action.payload;
      });
  },
});

export const { setDateRange, clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
