import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Card, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, CircularProgress } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchBudgets, addBudget, updateBudget, deleteBudget } from '../redux/slices/budgetSlice';
import { useToast } from '../components/common/Toast';
import { formatCurrency } from '../utils/currencyFormatter';

const BudgetsPage = () => {
  const dispatch = useDispatch();
  const { success, error } = useToast();
  const { budgets, loading } = useSelector((state) => state.budgets);
  const { userId } = useSelector((state) => state.auth);
  const { expenses } = useSelector((state) => state.expenses);
  const [open, setOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    limitAmount: '',
    alertPercentage: 80,
    period: 'MONTHLY'
  });

  useEffect(() => {
    if (userId) {
      dispatch(fetchBudgets(userId));
    }
  }, [dispatch, userId]);

  const handleOpen = (budget = null) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        categoryId: budget.categoryId,
        limitAmount: budget.limitAmount,
        alertPercentage: budget.alertPercentage || 80,
        period: budget.period || 'MONTHLY'
      });
    } else {
      setEditingBudget(null);
      setFormData({
        categoryId: '',
        limitAmount: '',
        alertPercentage: 80,
        period: 'MONTHLY'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBudget(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.categoryId || !formData.limitAmount) {
      error('Please fill all required fields');
      return;
    }

    const budgetData = {
      categoryId: parseInt(formData.categoryId),
      limitAmount: parseFloat(formData.limitAmount),
      alertPercentage: parseInt(formData.alertPercentage),
      period: formData.period
    };

    try {
      if (editingBudget) {
        await dispatch(updateBudget({ budgetId: editingBudget.id, budgetData })).unwrap();
        success('Budget updated successfully');
      } else {
        await dispatch(addBudget({ userId, budgetData })).unwrap();
        success('Budget added successfully');
      }
      handleClose();
      dispatch(fetchBudgets(userId));
    } catch (err) {
      error(editingBudget ? 'Failed to update budget' : 'Failed to add budget');
    }
  };

  const handleDelete = async (budgetId) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    try {
      await dispatch(deleteBudget(budgetId)).unwrap();
      success('Budget deleted successfully');
      dispatch(fetchBudgets(userId));
    } catch (err) {
      error('Failed to delete budget');
    }
  };

  const getBudgetProgress = (budget) => {
    const spent = expenses
      .filter(exp => exp.categoryId === budget.categoryId)
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const percentage = budget.limitAmount > 0 ? (spent / budget.limitAmount) * 100 : 0;
    return { spent, percentage };
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#EF4444';
    if (percentage >= 50) return '#F59E0B';
    return '#52B69A';
  };

  if (loading && budgets.length === 0) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h2" fontWeight={700} color="#0D1B2A">
          Budgets
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            backgroundColor: '#34A0A4',
            '&:hover': { backgroundColor: '#1A759F' },
            borderRadius: 2,
          }}
        >
          Add Budget
        </Button>
      </Box>

      <Box display="flex" flexDirection="column" gap={3}>
        {budgets.length > 0 ? (
          budgets.map((budget) => {
            const { spent, percentage } = getBudgetProgress(budget);
            const remaining = budget.limitAmount - spent;
            const progressColor = getProgressColor(percentage);

            return (
              <Card
                key={budget.id}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #E0E7FF',
                  position: 'relative',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} color="#0D1B2A">
                      {budget.category?.name || 'Category'}
                    </Typography>
                    <Typography variant="body2" color="#576B84">
                      {budget.period}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <IconButton onClick={() => handleOpen(budget)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(budget.id)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" fontWeight={600} color="#0D1B2A">
                    Spent: {formatCurrency(spent)}
                  </Typography>
                  <Typography variant="body2" color="#576B84">
                    Limit: {formatCurrency(budget.limitAmount)}
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={Math.min(percentage, 100)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#E0E7FF',
                    mb: 1,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: progressColor,
                      borderRadius: 4,
                    },
                  }}
                />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color={progressColor} fontWeight={600}>
                    {percentage.toFixed(1)}% used
                  </Typography>
                  <Typography
                    variant="caption"
                    color={remaining >= 0 ? '#52B69A' : '#EF4444'}
                    fontWeight={600}
                  >
                    {remaining >= 0 ? `${formatCurrency(remaining)} remaining` : `${formatCurrency(Math.abs(remaining))} over`}
                  </Typography>
                </Box>
              </Card>
            );
          })
        ) : (
          <Card sx={{ p: 6, borderRadius: 3, border: '1px solid #E0E7FF', textAlign: 'center' }}>
            <Typography variant="body2" color="#576B84">
              No budgets yet. Create your first budget to start tracking your spending!
            </Typography>
          </Card>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBudget ? 'Edit Budget' : 'Add Budget'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              select
              label="Category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              margin="normal"
              required
            >
              <MenuItem value="">Select Category</MenuItem>
              <MenuItem value="1">Food</MenuItem>
              <MenuItem value="2">Transport</MenuItem>
              <MenuItem value="3">Entertainment</MenuItem>
              <MenuItem value="4">Shopping</MenuItem>
              <MenuItem value="5">Utilities</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Monthly Limit"
              type="number"
              value={formData.limitAmount}
              onChange={(e) => setFormData({ ...formData, limitAmount: e.target.value })}
              margin="normal"
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              fullWidth
              label="Alert Threshold (%)"
              type="number"
              value={formData.alertPercentage}
              onChange={(e) => setFormData({ ...formData, alertPercentage: e.target.value })}
              margin="normal"
              inputProps={{ min: 0, max: 100, step: 1 }}
            />
            <TextField
              fullWidth
              select
              label="Period"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              margin="normal"
            >
              <MenuItem value="MONTHLY">Monthly</MenuItem>
              <MenuItem value="YEARLY">Yearly</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#34A0A4',
              '&:hover': { backgroundColor: '#1A759F' },
            }}
          >
            {editingBudget ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetsPage;
