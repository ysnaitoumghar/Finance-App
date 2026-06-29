import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as groupService from '../../services/groupService';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

function GroupForm({ userId, onGroupCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await groupService.createGroup(userId, formData);
      setFormData({ name: '', description: '' });
      if (onGroupCreated) onGroupCreated();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create Expense Group
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="name"
          label="Group Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleInputChange}
          multiline
          rows={3}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
        >
          Create Group
        </Button>
      </Box>
    </Paper>
  );
}

export default GroupForm;
