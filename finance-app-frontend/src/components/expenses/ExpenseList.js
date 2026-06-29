import React from 'react';
import { Box, List, ListItem, ListItemText, Typography, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function ExpenseList({ expenses, onDelete, onRefresh }) {
  if (!expenses || expenses.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1" align="center">
          No expenses found
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Recent Expenses
      </Typography>
      <List>
        {expenses.map((expense) => (
          <ListItem
            key={expense.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => onDelete(expense.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${expense.category?.name || 'Uncategorized'} - ₹${expense.amount}`}
              secondary={`${expense.description || 'No description'} | ${expense.expenseDate} | ${expense.paymentMethod}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default ExpenseList;
