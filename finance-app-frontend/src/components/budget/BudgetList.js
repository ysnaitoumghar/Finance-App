import React from 'react';
import { Box, List, ListItem, ListItemText, Typography, Paper, Chip, alpha } from '@mui/material';
import { COLORS } from '../../theme';

function BudgetList({ budgets }) {
  if (!budgets || budgets.length === 0) {
    return (
      <Paper sx={{ p: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
        <Typography variant="body1" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
          No budgets found
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
      <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 2 }}>
        Your Budgets
      </Typography>
      <List sx={{ p: 0 }}>
        {budgets.map((budget) => (
          <ListItem
            key={budget.id}
            sx={{
              borderBottom: `1px solid ${COLORS.panelBorder}`,
              '&:last-child': { borderBottom: 'none' },
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>
                    {budget.category?.name || 'Overall Budget'}
                  </Typography>
                  <Chip label={budget.period} size="small" sx={{ bgcolor: alpha(COLORS.gold, 0.15), color: COLORS.gold, fontFamily: 'Inter, sans-serif' }} />
                </Box>
              }
              secondary={<Typography sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>{`Limit: ₹${budget.limitAmount} | Alert at: ${budget.alertPercentage}%`}</Typography>}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default BudgetList;
