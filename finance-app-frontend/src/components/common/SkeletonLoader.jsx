import React from 'react';
import { Box, Skeleton, Card, CardContent } from '@mui/material';

export const CardSkeleton = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" width="40%" height={32} />
      <Skeleton variant="text" width="60%" height={48} />
      <Skeleton variant="text" width="30%" height={24} />
    </CardContent>
  </Card>
);

export const ChartSkeleton = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={300} />
    </CardContent>
  </Card>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <Box>
    {[...Array(rows)].map((_, index) => (
      <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Skeleton variant="rectangular" width="20%" height={40} />
        <Skeleton variant="rectangular" width="30%" height={40} />
        <Skeleton variant="rectangular" width="20%" height={40} />
        <Skeleton variant="rectangular" width="15%" height={40} />
        <Skeleton variant="rectangular" width="15%" height={40} />
      </Box>
    ))}
  </Box>
);

export const SummaryCardSkeleton = () => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="text" width={60} height={24} />
      </Box>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={48} />
      <Skeleton variant="text" width="30%" height={24} />
    </CardContent>
  </Card>
);
