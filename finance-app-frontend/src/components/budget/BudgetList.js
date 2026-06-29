import React from 'react';
import { Box, List, ListItem, ListItemText, Typography, Paper, Chip } from '@mui/material';

function BudgetList({ budgets }) {
  if (!budgets || budgets.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1" align="center">
          No budgets found
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Your Budgets
      </Typography>
      <List>
        {budgets.map((budget) => (
          <ListItem key={budget.id}>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1">
                    {budget.category?.name || 'Overall Budget'}
                  </Typography>
                  <Chip label={budget.period} size="small" />
                </Box>
              }
              secondary={`Limit: ₹${budget.limitAmount} | Alert at: ${budget.alertPercentage}%`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default BudgetList;
