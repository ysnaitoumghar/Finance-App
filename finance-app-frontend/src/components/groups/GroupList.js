import React from 'react';
import { Box, List, ListItem, ListItemText, Typography, Paper } from '@mui/material';

function GroupList({ groups, onSelectGroup }) {
  if (!groups || groups.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1" align="center">
          No groups found
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Your Groups
      </Typography>
      <List>
        {groups.map((group) => (
          <ListItem 
            key={group.id} 
            button 
            onClick={() => onSelectGroup(group)}
          >
            <ListItemText
              primary={group.name}
              secondary={group.description || 'No description'}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default GroupList;
