import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBudgets } from '../../redux/slices/budgetSlice';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import { Box, Typography } from '@mui/material';

function BudgetPage() {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.userId);
  const { budgets, loading } = useSelector(state => state.budgets);

  useEffect(() => {
    if (userId) {
      dispatch(fetchBudgets(userId));
    }
  }, [userId, dispatch]);

  const handleBudgetAdded = () => {
    dispatch(fetchBudgets(userId));
  };

  if (!userId) {
    return <Typography>Please login to view budgets</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Budget Management
      </Typography>
      <BudgetForm userId={userId} onBudgetAdded={handleBudgetAdded} />
      <BudgetList budgets={budgets} />
    </Box>
  );
}

export default BudgetPage;
