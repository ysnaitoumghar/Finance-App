import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, CircularProgress, GlobalStyles } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchExpenses, addExpense, updateExpense, deleteExpense } from '../redux/slices/expenseSlice';
import { fetchCategories } from '../redux/slices/categorySlice';
import { useToast } from '../components/common/Toast';
import { formatCurrency } from '../utils/currencyFormatter';
import { getDateRanges, formatDate } from '../utils/dateHelpers';
import { COLORS } from '../theme';

const TransactionsPage = () => {
  const dispatch = useDispatch();
  const { success, error } = useToast();
  const { expenses, loading } = useSelector((state) => state.expenses);
  const { categories } = useSelector((state) => state.categories);
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
      dispatch(fetchCategories({ userId, type: 'EXPENSE' }));
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
      console.error('Expense operation error:', err);
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
      console.error('Expense delete error:', err);
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
    <>
      <GlobalStyles
          styles={{
            '@keyframes floatGrid': {
              '0%': { backgroundPosition: '0px 0px' },
              '100%': { backgroundPosition: '0px -48px' },
            },
          }}
      />
      <Box
          sx={{
            minHeight: '100vh',
            width: '100%',
            bgcolor: COLORS.bg,
            position: 'relative',
            overflow: 'hidden',
            p: 3,
            maxWidth: 1400,
            mx: 'auto',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(${COLORS.panelBorder} 1px, transparent 1px),
                             linear-gradient(90deg, ${COLORS.panelBorder} 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
              opacity: 0.25,
              animation: 'floatGrid 12s linear infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at 50% 20%, ${COLORS.bgVignette} 0%, ${COLORS.bg} 70%)`,
            },
          }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h2" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text }}>
          Transactions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            background: `linear-gradient(90deg, ${COLORS.gold}, #E8C766)`,
            color: '#0A0E17',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '10px',
            boxShadow: `0 8px 24px -8px ${COLORS.goldSoft}`,
            '&:hover': {
              background: `linear-gradient(90deg, #E8C766, ${COLORS.gold})`,
              transform: 'translateY(-1px)',
              boxShadow: `0 12px 28px -8px ${COLORS.goldSoft}`,
            },
          }}
        >
          Add Expense
        </Button>
      </Box>

      <Card sx={{ bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { borderBottom: `1px solid ${COLORS.panelBorder}` } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</TableCell>
                <TableCell sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</TableCell>
                <TableCell sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</TableCell>
                <TableCell sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Method</TableCell>
                <TableCell align="right" sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</TableCell>
                <TableCell align="right" sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(expenses || []).length > 0 ? (
                (expenses || []).map((expense) => (
                  <TableRow
                    key={expense.id}
                    sx={{
                      '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.05)' },
                    }}
                  >
                    <TableCell sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>{new Date(expense.expenseDate).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>{expense.description}</TableCell>
                    <TableCell sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>{expense.category?.name || 'Uncategorized'}</TableCell>
                    <TableCell sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>{expense.paymentMethod || 'Cash'}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: COLORS.red,
                        fontWeight: 600,
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      -{formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpen(expense)} size="small" sx={{ color: COLORS.textDim, '&:hover': { color: COLORS.gold } }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(expense.id)} size="small" sx={{ color: COLORS.textDim, '&:hover': { color: COLORS.red } }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
                      No transactions yet. Add your first expense to get started!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: COLORS.panel,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${COLORS.panelBorder}`,
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text }}>
          {editingExpense ? 'Edit Expense' : 'Add Expense'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: COLORS.fieldBg,
                  color: COLORS.text,
                  fontFamily: 'Inter, sans-serif',
                  '& fieldset': { borderColor: COLORS.fieldBorder },
                  '&:hover fieldset': { borderColor: COLORS.goldSoft },
                  '&.Mui-focused fieldset': { borderColor: COLORS.gold, borderWidth: '1px' },
                },
                '& .MuiInputLabel-root': {
                  color: COLORS.textFaint,
                  fontFamily: 'Inter, sans-serif',
                  '&.Mui-focused': { color: COLORS.gold },
                },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: COLORS.fieldBg,
                  color: COLORS.text,
                  fontFamily: 'JetBrains Mono, monospace',
                  '& fieldset': { borderColor: COLORS.fieldBorder },
                  '&:hover fieldset': { borderColor: COLORS.goldSoft },
                  '&.Mui-focused fieldset': { borderColor: COLORS.gold, borderWidth: '1px' },
                },
                '& .MuiInputLabel-root': {
                  color: COLORS.textFaint,
                  fontFamily: 'Inter, sans-serif',
                  '&.Mui-focused': { color: COLORS.gold },
                },
              }}
            />
            <TextField
              fullWidth
              select
              label="Category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: COLORS.fieldBg,
                  color: COLORS.text,
                  fontFamily: 'Inter, sans-serif',
                  '& fieldset': { borderColor: COLORS.fieldBorder },
                  '&:hover fieldset': { borderColor: COLORS.goldSoft },
                  '&.Mui-focused fieldset': { borderColor: COLORS.gold, borderWidth: '1px' },
                },
                '& .MuiInputLabel-root': {
                  color: COLORS.textFaint,
                  fontFamily: 'Inter, sans-serif',
                  '&.Mui-focused': { color: COLORS.gold },
                },
                '& .MuiSelect-icon': { color: COLORS.textDim },
              }}
            >
              <MenuItem value="" sx={{ color: COLORS.text }}>Select Category</MenuItem>
              {(categories || []).map((category) => (
                <MenuItem key={category.id} value={category.id} sx={{ color: COLORS.text }}>
                  {category.name}
                </MenuItem>
              ))}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: COLORS.fieldBg,
                  color: COLORS.text,
                  fontFamily: 'Inter, sans-serif',
                  '& fieldset': { borderColor: COLORS.fieldBorder },
                  '&:hover fieldset': { borderColor: COLORS.goldSoft },
                  '&.Mui-focused fieldset': { borderColor: COLORS.gold, borderWidth: '1px' },
                },
                '& .MuiInputLabel-root': {
                  color: COLORS.textFaint,
                  fontFamily: 'Inter, sans-serif',
                  '&.Mui-focused': { color: COLORS.gold },
                },
              }}
            />
            <TextField
              fullWidth
              select
              label="Payment Method"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: COLORS.fieldBg,
                  color: COLORS.text,
                  fontFamily: 'Inter, sans-serif',
                  '& fieldset': { borderColor: COLORS.fieldBorder },
                  '&:hover fieldset': { borderColor: COLORS.goldSoft },
                  '&.Mui-focused fieldset': { borderColor: COLORS.gold, borderWidth: '1px' },
                },
                '& .MuiInputLabel-root': {
                  color: COLORS.textFaint,
                  fontFamily: 'Inter, sans-serif',
                  '&.Mui-focused': { color: COLORS.gold },
                },
                '& .MuiSelect-icon': { color: COLORS.textDim },
              }}
            >
              <MenuItem value="Cash" sx={{ color: COLORS.text }}>Cash</MenuItem>
              <MenuItem value="Credit Card" sx={{ color: COLORS.text }}>Credit Card</MenuItem>
              <MenuItem value="Debit Card" sx={{ color: COLORS.text }}>Debit Card</MenuItem>
              <MenuItem value="Bank Transfer" sx={{ color: COLORS.text }}>Bank Transfer</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose}
            sx={{
              color: COLORS.textDim,
              fontFamily: 'Inter, sans-serif',
              '&:hover': {
                backgroundColor: 'rgba(212, 175, 55, 0.08)',
                color: COLORS.text,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: `linear-gradient(90deg, ${COLORS.gold}, #E8C766)`,
              color: '#0A0E17',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '10px',
              boxShadow: `0 8px 24px -8px ${COLORS.goldSoft}`,
              '&:hover': {
                background: `linear-gradient(90deg, #E8C766, ${COLORS.gold})`,
                transform: 'translateY(-1px)',
                boxShadow: `0 12px 28px -8px ${COLORS.goldSoft}`,
              },
            }}
          >
            {editingExpense ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
        </Box>
      </Box>
    </>
  );
};

export default TransactionsPage;
