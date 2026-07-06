import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as groupService from '../../services/groupService';
import * as sharedExpenseService from '../../services/sharedExpenseService';
import GroupForm from './GroupForm';
import GroupList from './GroupList';
import SharedExpenseForm from './SharedExpenseForm';
import { Box, Typography, Paper, List, ListItem, ListItemText, Button, GlobalStyles } from '@mui/material';
import { COLORS } from '../../theme';

function GroupsPage() {
  const userId = useSelector(state => state.auth.userId);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [sharedExpenses, setSharedExpenses] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchGroups();
    }
  }, [userId]);

  const fetchGroups = async () => {
    try {
      const response = await groupService.getGroups(userId);
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleGroupCreated = () => {
    fetchGroups();
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    fetchSharedExpenses(group.id);
  };

  const fetchSharedExpenses = async (groupId) => {
    try {
      const response = await sharedExpenseService.getSharedExpenses(groupId);
      setSharedExpenses(response.data);
    } catch (error) {
      console.error('Error fetching shared expenses:', error);
    }
  };

  const handleExpenseAdded = () => {
    if (selectedGroup) {
      fetchSharedExpenses(selectedGroup.id);
    }
  };

  if (!userId) {
    return <Typography>Please login to view groups</Typography>;
  }

  return (
    <>
      <GlobalStyles
          styles={{
            '@keyframes floatGrid': {
              '0%': { backgroundPosition: '0px 0px' },
              '100%': { backgroundPosition: '0px -48px' },
            },
          }}
      />
      <Box
          sx={{
            minHeight: '100vh',
            width: '100%',
            bgcolor: COLORS.bg,
            position: 'relative',
            overflow: 'hidden',
            p: 3,
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(${COLORS.panelBorder} 1px, transparent 1px),
                             linear-gradient(90deg, ${COLORS.panelBorder} 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
              opacity: 0.25,
              animation: 'floatGrid 12s linear infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at 50% 20%, ${COLORS.bgVignette} 0%, ${COLORS.bg} 70%)`,
            },
          }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Typography variant="h4" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 1 }}>
        Shared Expenses
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif', mb: 4 }}>
        Manage group expenses and split bills with friends
      </Typography>
      {!selectedGroup ? (
        <>
          <GroupForm userId={userId} onGroupCreated={handleGroupCreated} />
          <GroupList groups={groups} onSelectGroup={handleSelectGroup} />
        </>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
            <Button 
              onClick={() => setSelectedGroup(null)}
              sx={{
                color: COLORS.textDim,
                fontFamily: 'Inter, sans-serif',
                '&:hover': {
                  backgroundColor: 'rgba(212, 175, 55, 0.08)',
                  color: COLORS.gold,
                },
              }}
            >
              Back to Groups
            </Button>
            <Typography variant="h6" sx={{ mt: 2, fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text }}>
              {selectedGroup.name}
            </Typography>
          </Paper>
          <SharedExpenseForm groupId={selectedGroup.id} onExpenseAdded={handleExpenseAdded} />
          <Paper sx={{ p: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
            <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 2 }}>
              Shared Expenses
            </Typography>
            <List sx={{ p: 0 }}>
              {sharedExpenses?.map((expense) => (
                <ListItem 
                  key={expense.id}
                  sx={{
                    borderBottom: `1px solid ${COLORS.panelBorder}`,
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <ListItemText
                    primary={<Typography sx={{ color: COLORS.text, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{`₹${expense.amount} - ${expense.description || 'No description'}`}</Typography>}
                    secondary={<Typography sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>{`Paid by: User ${expense.paidBy} | Date: ${expense.expenseDate}`}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      )}
        </Box>
      </Box>
    </>
  );
}

export default GroupsPage;
