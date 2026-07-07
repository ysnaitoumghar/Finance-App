import React from 'react';
import { Box, List, ListItem, ListItemText, Typography, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { COLORS } from '../../theme';

function ExpenseList({ expenses, onDelete, onRefresh }) {
  if (!expenses || expenses.length === 0) {
    return (
      <Paper sx={{ p: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
        <Typography variant="body1" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
          No expenses found
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
      <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 2 }}>
        Recent Expenses
      </Typography>
      <List sx={{ p: 0 }}>
        {expenses?.map((expense) => (
          <ListItem
            key={expense.id}
            secondaryAction={
              <IconButton 
                edge="end" 
                onClick={() => onDelete(expense.id)}
                sx={{ color: COLORS.textDim, '&:hover': { color: COLORS.red } }}
              >
                <DeleteIcon />
              </IconButton>
            }
            sx={{
              borderBottom: `1px solid ${COLORS.panelBorder}`,
              '&:last-child': { borderBottom: 'none' },
            }}
          >
            <ListItemText
              primary={<Typography sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{`${expense.category?.name || 'Uncategorized'} - ₹${expense.amount}`}</Typography>}
              secondary={<Typography sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>{`${expense.description || 'No description'} | ${expense.expenseDate} | ${expense.paymentMethod}`}</Typography>}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default ExpenseList;
