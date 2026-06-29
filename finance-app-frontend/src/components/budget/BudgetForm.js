import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBudget } from '../../redux/slices/budgetSlice';
import * as categoryService from '../../services/categoryService';
import { Box, TextField, Select, MenuItem, Button, Typography, Paper } from '@mui/material';

function BudgetForm({ userId, onBudgetAdded }) {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    limitAmount: '',
    period: 'MONTHLY',
    alertPercentage: 80
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
      await dispatch(addBudget({ userId, budgetData: formData }));
      setFormData({
        categoryId: '',
        limitAmount: '',
        period: 'MONTHLY',
        alertPercentage: 80
      });
      if (onBudgetAdded) onBudgetAdded();
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create Budget
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Select
          fullWidth
          margin="normal"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          displayEmpty
        >
          <MenuItem value="">Select Category (Optional)</MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
          ))}
        </Select>
        <TextField
          fullWidth
          margin="normal"
          name="limitAmount"
          label="Limit Amount"
          type="number"
          value={formData.limitAmount}
          onChange={handleInputChange}
          step="0.01"
          required
        />
        <Select
          fullWidth
          margin="normal"
          name="period"
          value={formData.period}
          onChange={handleInputChange}
        >
          <MenuItem value="MONTHLY">Monthly</MenuItem>
          <MenuItem value="YEARLY">Yearly</MenuItem>
        </Select>
        <TextField
          fullWidth
          margin="normal"
          name="alertPercentage"
          label="Alert Percentage"
          type="number"
          value={formData.alertPercentage}
          onChange={handleInputChange}
          inputProps={{ min: 1, max: 100 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
        >
          Create Budget
        </Button>
      </Box>
    </Paper>
  );
}

export default BudgetForm;
