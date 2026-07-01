import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, CircularProgress } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchExpenses, addExpense, updateExpense, deleteExpense } from '../redux/slices/expenseSlice';
import { useToast } from '../components/common/Toast';
import { formatCurrency } from '../utils/currencyFormatter';
import { getDateRanges, formatDate } from '../utils/dateHelpers';

const TransactionsPage = () => {
  const dispatch = useDispatch();
  const { success, error } = useToast();
  const { expenses, loading } = useSelector((state) => state.expenses);
  const { userId } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash'
  });

  useEffect(() => {
    if (userId) {
      const defaultRange = getDateRanges().thisMonth;
      dispatch(fetchExpenses({
        userId,
        startDate: formatDate(defaultRange.start),
        endDate: formatDate(defaultRange.end)
      }));
    }
  }, [dispatch, userId]);

  const handleOpen = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        description: expense.description,
        amount: expense.amount,
        categoryId: expense.categoryId,
        expenseDate: expense.expenseDate ? expense.expenseDate.split('T')[0] : new Date().toISOString().split('T')[0],
        paymentMethod: expense.paymentMethod || 'Cash'
      });
    } else {
      setEditingExpense(null);
      setFormData({
        description: '',
        amount: '',
        categoryId: '',
        expenseDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingExpense(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.categoryId) {
      error('Please fill all required fields');
      return;
    }

    const expenseData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      categoryId: parseInt(formData.categoryId),
      expenseDate: formData.expenseDate,
      paymentMethod: formData.paymentMethod
    };

    try {
      if (editingExpense) {
        await dispatch(updateExpense({ expenseId: editingExpense.id, expenseData })).unwrap();
        success('Expense updated successfully');
      } else {
        await dispatch(addExpense({ userId, expenseData })).unwrap();
        success('Expense added successfully');
      }
      handleClose();
      
      // Refresh expenses
      const defaultRange = getDateRanges().thisMonth;
      dispatch(fetchExpenses({
        userId,
        startDate: formatDate(defaultRange.start),
        endDate: formatDate(defaultRange.end)
      }));
    } catch (err) {
      error(editingExpense ? 'Failed to update expense' : 'Failed to add expense');
    }
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await dispatch(deleteExpense(expenseId)).unwrap();
      success('Expense deleted successfully');
      
      // Refresh expenses
      const defaultRange = getDateRanges().thisMonth;
      dispatch(fetchExpenses({
        userId,
        startDate: formatDate(defaultRange.start),
        endDate: formatDate(defaultRange.end)
      }));
    } catch (err) {
      error('Failed to delete expense');
    }
  };

  if (loading && expenses.length === 0) {
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
          Transactions
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
          Add Expense
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, border: '1px solid #E0E7FF' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.length > 0 ? (
                expenses.map((expense) => (
                  <TableRow
                    key={expense.id}
                    sx={{
                      backgroundColor: expenses.indexOf(expense) % 2 === 0 ? '#F8FAFC' : '#FFFFFF',
                      '&:hover': { backgroundColor: '#E0E7FF' },
                    }}
                  >
                    <TableCell>{new Date(expense.expenseDate).toLocaleDateString()}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.category?.name || 'Uncategorized'}</TableCell>
                    <TableCell>{expense.paymentMethod || 'Cash'}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: '#EF4444',
                        fontWeight: 600,
                      }}
                    >
                      -{formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpen(expense)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(expense.id)} size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography variant="body2" color="#576B84">
                      No transactions yet. Add your first expense to get started!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              margin="normal"
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
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
              label="Date"
              type="date"
              value={formData.expenseDate}
              onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              select
              label="Payment Method"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              margin="normal"
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="Debit Card">Debit Card</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
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
            {editingExpense ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionsPage;
