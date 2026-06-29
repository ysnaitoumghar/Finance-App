import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchExpenses, fetchExpenseAnalytics, deleteExpense } from '../../redux/slices/expenseSlice';
import ExpenseForm from '../expenses/ExpenseForm';
import ExpenseList from '../expenses/ExpenseList';
import Analytics from '../analytics/Analytics';
import { Box, Grid, Typography, Paper } from '@mui/material';

function Dashboard() {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.userId);
  const { expenses, analytics, loading } = useSelector(state => state.expenses);
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchExpenses({ userId, startDate, endDate }));
      dispatch(fetchExpenseAnalytics({ userId, startDate, endDate }));
    }
  }, [userId, startDate, endDate, dispatch]);

  const handleExpenseAdded = () => {
    dispatch(fetchExpenses({ userId, startDate, endDate }));
    dispatch(fetchExpenseAnalytics({ userId, startDate, endDate }));
  };

  const handleDeleteExpense = (expenseId) => {
    dispatch(deleteExpense(expenseId)).then(() => {
      dispatch(fetchExpenses({ userId, startDate, endDate }));
      dispatch(fetchExpenseAnalytics({ userId, startDate, endDate }));
    });
  };

  if (!userId) {
    return <Typography>Please login to view dashboard</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ExpenseForm userId={userId} onExpenseAdded={handleExpenseAdded} />
          <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
        </Grid>
        <Grid item xs={12} md={6}>
          {analytics && <Analytics analytics={analytics} />}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
