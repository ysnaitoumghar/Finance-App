import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, fetchCategories } from '../../redux/slices/expenseSlice';
import * as categoryService from '../../services/categoryService';
import { Box, TextField, Select, MenuItem, Button, Typography, Paper } from '@mui/material';

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
      await dispatch(addExpense({ userId, expenseData: formData }));
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
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
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
        />
        <Select
          fullWidth
          margin="normal"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          required
          displayEmpty
        >
          <MenuItem value="">Select Category</MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
          ))}
        </Select>
        <TextField
          fullWidth
          margin="normal"
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleInputChange}
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
        />
        <Select
          fullWidth
          margin="normal"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleInputChange}
        >
          <MenuItem value="CASH">Cash</MenuItem>
          <MenuItem value="CARD">Card</MenuItem>
          <MenuItem value="UPI">UPI</MenuItem>
          <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
        </Select>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
        >
          Add Expense
        </Button>
      </Box>
    </Paper>
  );
}

export default ExpenseForm;
