import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { 
  Inbox as InboxIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { COLORS } from '../../theme';

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
          color: COLORS.textDim,
          opacity: 0.4,
        }}
      >
        {icon || defaultIcons.expenses}
      </Box>
      <Typography 
        variant={titleVariant} 
        gutterBottom 
        sx={{
          fontWeight: 600,
          fontFamily: 'Fraunces, serif',
          color: COLORS.text,
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          color: COLORS.textDim,
          fontFamily: 'Inter, sans-serif',
          mb: actionText ? 3 : 0,
          maxWidth: 400
        }}
      >
        {description}
      </Typography>
      {actionText && onAction && (
        <Button 
          variant="contained" 
          onClick={onAction}
          sx={{
            background: `linear-gradient(90deg, ${COLORS.gold}, #E8C766)`,
            color: '#0A0E17',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '10px',
            boxShadow: `0 8px 24px -8px ${COLORS.goldSoft}`,
          }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
