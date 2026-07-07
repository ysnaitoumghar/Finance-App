import React from 'react';
import { Box, List, ListItem, ListItemText, Typography, Paper } from '@mui/material';
import { COLORS } from '../../theme';

function GroupList({ groups, onSelectGroup }) {
  if (!groups || groups.length === 0) {
    return (
      <Paper sx={{ p: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
        <Typography variant="body1" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
          No groups found
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
      <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 2 }}>
        Your Groups
      </Typography>
      <List sx={{ p: 0 }}>
        {groups?.map((group) => (
          <ListItem
            key={group.id}
            onClick={() => onSelectGroup(group)}
            sx={{
              borderBottom: `1px solid ${COLORS.panelBorder}`,
              '&:last-child': { borderBottom: 'none' },
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(212, 175, 55, 0.08)',
              },
            }}
          >
            <ListItemText
              primary={<Typography sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{group.name}</Typography>}
              secondary={<Typography sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>{group.description || 'No description'}</Typography>}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default GroupList;
