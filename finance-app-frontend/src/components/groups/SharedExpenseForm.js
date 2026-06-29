import React, { useState } from 'react';
import * as sharedExpenseService from '../../services/sharedExpenseService';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

function SharedExpenseForm({ groupId, onExpenseAdded }) {
  const [formData, setFormData] = useState({
    paidBy: '',
    categoryId: '',
    amount: '',
    description: '',
    expenseDate: new Date().toISOString().split('T')[0]
  });

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
      await sharedExpenseService.createSharedExpense(groupId, formData);
      setFormData({
        paidBy: '',
        categoryId: '',
        amount: '',
        description: '',
        expenseDate: new Date().toISOString().split('T')[0]
      });
      if (onExpenseAdded) onExpenseAdded();
    } catch (error) {
      console.error('Error adding shared expense:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Shared Expense
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="paidBy"
          label="Paid By User ID"
          value={formData.paidBy}
          onChange={handleInputChange}
          required
        />
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
        >
          Add Shared Expense
        </Button>
      </Box>
    </Paper>
  );
}

export default SharedExpenseForm;
