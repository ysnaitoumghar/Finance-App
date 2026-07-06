import React from 'react';
import { Box, Skeleton, Card, CardContent } from '@mui/material';
import { COLORS } from '../../theme';

export const CardSkeleton = () => (
  <Card sx={{ bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px' }}>
    <CardContent>
      <Skeleton variant="text" width="40%" height={32} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
      <Skeleton variant="text" width="60%" height={48} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
      <Skeleton variant="text" width="30%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
    </CardContent>
  </Card>
);

export const ChartSkeleton = () => (
  <Card sx={{ bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px' }}>
    <CardContent>
      <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.08)' }} />
      <Skeleton variant="rectangular" width="100%" height={300} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
    </CardContent>
  </Card>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <Box>
    {[...Array(rows)].map((_, index) => (
      <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Skeleton variant="rectangular" width="20%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '8px' }} />
        <Skeleton variant="rectangular" width="30%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '8px' }} />
        <Skeleton variant="rectangular" width="20%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '8px' }} />
        <Skeleton variant="rectangular" width="15%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '8px' }} />
        <Skeleton variant="rectangular" width="15%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '8px' }} />
      </Box>
    ))}
  </Box>
);

export const SummaryCardSkeleton = () => (
  <Card sx={{ height: '100%', bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={48} height={48} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
        <Skeleton variant="text" width={60} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
      </Box>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.08)' }} />
      <Skeleton variant="text" width="60%" height={48} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
      <Skeleton variant="text" width="30%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
    </CardContent>
  </Card>
);
