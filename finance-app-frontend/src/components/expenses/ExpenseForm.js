import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, fetchCategories } from '../../redux/slices/expenseSlice';
import * as categoryService from '../../services/categoryService';
import { Box, TextField, Select, MenuItem, Button, Typography, Paper, FormControl, InputLabel } from '@mui/material';
import { COLORS } from '../../theme';

function ExpenseForm({ userId, onExpenseAdded }) {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    description: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CASH'
  });

  useEffect(() => {
    fetchCategoriesList();
  }, [userId]);

  const fetchCategoriesList = async () => {
    try {
      const response = await categoryService.getCategories(userId, 'EXPENSE');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addExpense({ userId, expenseData: formData })).unwrap();
      setFormData({
        amount: '',
        categoryId: '',
        description: '',
        expenseDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'CASH'
      });
      if (onExpenseAdded) onExpenseAdded();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
      <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 2 }}>
        Add Expense
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="amount"
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={handleInputChange}
          step="0.01"
          required
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
        <FormControl fullWidth margin="normal" required>
          <InputLabel sx={{ color: COLORS.textFaint, fontFamily: 'Inter, sans-serif', '&.Mui-focused': { color: COLORS.gold } }}>Category</InputLabel>
          <Select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            displayEmpty
            label="Category"
            sx={{
              borderRadius: '10px',
              bgcolor: COLORS.fieldBg,
              color: COLORS.text,
              fontFamily: 'Inter, sans-serif',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.fieldBorder },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.goldSoft },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.gold, borderWidth: '1px' },
              '& .MuiSelect-icon': { color: COLORS.textDim },
            }}
          >
            <MenuItem value="" sx={{ color: COLORS.text }}>Select Category</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id} sx={{ color: COLORS.text }}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleInputChange}
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
          margin="normal"
          name="expenseDate"
          label="Date"
          type="date"
          value={formData.expenseDate}
          onChange={handleInputChange}
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
        <FormControl fullWidth margin="normal">
          <InputLabel sx={{ color: COLORS.textFaint, fontFamily: 'Inter, sans-serif', '&.Mui-focused': { color: COLORS.gold } }}>Payment Method</InputLabel>
          <Select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            label="Payment Method"
            sx={{
              borderRadius: '10px',
              bgcolor: COLORS.fieldBg,
              color: COLORS.text,
              fontFamily: 'Inter, sans-serif',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.fieldBorder },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.goldSoft },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.gold, borderWidth: '1px' },
              '& .MuiSelect-icon': { color: COLORS.textDim },
            }}
          >
            <MenuItem value="CASH" sx={{ color: COLORS.text }}>Cash</MenuItem>
            <MenuItem value="CARD" sx={{ color: COLORS.text }}>Card</MenuItem>
            <MenuItem value="UPI" sx={{ color: COLORS.text }}>UPI</MenuItem>
            <MenuItem value="BANK_TRANSFER" sx={{ color: COLORS.text }}>Bank Transfer</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
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
    </Paper>
  );
}

export default ExpenseForm;
