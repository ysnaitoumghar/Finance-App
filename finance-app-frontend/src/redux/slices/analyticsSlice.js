import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as analyticsService from '../../services/analyticsService';

const initialState = {
  selectedDateRange: {
    startDate: null,
    endDate: null,
    label: 'This Month'
  },
  analyticsData: {
    summary: null,
    byCategory: [],
    trend: [],
    budgetStatus: []
  },
  loading: false,
  error: null,
  filters: {
    categories: [],
    types: []
  }
};

export const fetchAnalyticsSummary = createAsyncThunk(
  'analytics/fetchSummary',
  async ({ userId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getSummary(userId, startDate, endDate);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch summary' });
    }
  }
);

export const fetchAnalyticsByCategory = createAsyncThunk(
  'analytics/fetchByCategory',
  async ({ userId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getByCategory(userId, startDate, endDate);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch category data' });
    }
  }
);

export const fetchAnalyticsTrend = createAsyncThunk(
  'analytics/fetchTrend',
  async ({ userId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getTrend(userId, startDate, endDate);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch trend data' });
    }
  }
);

export const fetchBudgetStatus = createAsyncThunk(
  'analytics/fetchBudgetStatus',
  async ({ userId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getBudgetStatus(userId, startDate, endDate);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch budget status' });
    }
  }
);

export const fetchAllAnalytics = createAsyncThunk(
  'analytics/fetchAll',
  async ({ userId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const [summary, byCategory, trend, budgetStatus] = await Promise.all([
        analyticsService.getSummary(userId, startDate, endDate),
        analyticsService.getByCategory(userId, startDate, endDate),
        analyticsService.getTrend(userId, startDate, endDate),
        analyticsService.getBudgetStatus(userId, startDate, endDate)
      ]);
      
      return {
        summary: summary.data,
        byCategory: byCategory.data,
        trend: trend.data,
        budgetStatus: budgetStatus.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch analytics data' });
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.selectedDateRange = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearAnalytics: (state) => {
      state.analyticsData = {
        summary: null,
        byCategory: [],
        trend: [],
        budgetStatus: []
      };
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsData.summary = action.payload;
      })
      .addCase(fetchAnalyticsSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch summary';
      })
      .addCase(fetchAnalyticsByCategory.fulfilled, (state, action) => {
        state.analyticsData.byCategory = action.payload;
      })
      .addCase(fetchAnalyticsByCategory.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to fetch category data';
      })
      .addCase(fetchAnalyticsTrend.fulfilled, (state, action) => {
        state.analyticsData.trend = action.payload;
      })
      .addCase(fetchAnalyticsTrend.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to fetch trend data';
      })
      .addCase(fetchBudgetStatus.fulfilled, (state, action) => {
        state.analyticsData.budgetStatus = action.payload;
      })
      .addCase(fetchBudgetStatus.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to fetch budget status';
      })
      .addCase(fetchAllAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsData = action.payload;
      })
      .addCase(fetchAllAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch analytics data';
      });
  }
});

export const { setDateRange, setFilters, clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
