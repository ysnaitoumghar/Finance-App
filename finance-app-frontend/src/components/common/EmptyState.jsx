import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { 
  Inbox as InboxIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  actionText, 
  onAction,
  size = 'medium'
}) => {
  const theme = useTheme();
  
  const iconSize = size === 'large' ? 80 : size === 'small' ? 48 : 64;
  const titleVariant = size === 'large' ? 'h4' : size === 'small' ? 'h6' : 'h5';
  
  const defaultIcons = {
    expenses: <InboxIcon sx={{ fontSize: iconSize }} />,
    income: <TrendingUpIcon sx={{ fontSize: iconSize }} />,
    budgets: <AccountBalanceIcon sx={{ fontSize: iconSize }} />,
    reports: <DescriptionIcon sx={{ fontSize: iconSize }} />,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: size === 'large' ? 12 : size === 'small' ? 6 : 8,
        px: 4,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          mb: 3,
          color: theme.palette.text.secondary,
          opacity: 0.5,
        }}
      >
        {icon || defaultIcons.expenses}
      </Box>
      <Typography variant={titleVariant} gutterBottom fontWeight={600}>
        {title}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: actionText ? 3 : 0, maxWidth: 400 }}
      >
        {description}
      </Typography>
      {actionText && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
