import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as groupService from '../../services/groupService';
import * as sharedExpenseService from '../../services/sharedExpenseService';
import GroupForm from './GroupForm';
import GroupList from './GroupList';
import SharedExpenseForm from './SharedExpenseForm';
import { Box, Typography, Paper, List, ListItem, ListItemText, Button } from '@mui/material';

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Shared Expenses
      </Typography>
      {!selectedGroup ? (
        <>
          <GroupForm userId={userId} onGroupCreated={handleGroupCreated} />
          <GroupList groups={groups} onSelectGroup={handleSelectGroup} />
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Button onClick={() => setSelectedGroup(null)}>Back to Groups</Button>
            <Typography variant="h6" sx={{ mt: 2 }}>
              {selectedGroup.name}
            </Typography>
          </Paper>
          <SharedExpenseForm groupId={selectedGroup.id} onExpenseAdded={handleExpenseAdded} />
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shared Expenses
            </Typography>
            <List>
              {sharedExpenses.map((expense) => (
                <ListItem key={expense.id}>
                  <ListItemText
                    primary={`₹${expense.amount} - ${expense.description || 'No description'}`}
                    secondary={`Paid by: User ${expense.paidBy} | Date: ${expense.expenseDate}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      )}
    </Box>
  );
}

export default GroupsPage;
