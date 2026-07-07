import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as groupService from '../../services/groupService';
import { Box, TextField, Button, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { COLORS } from '../../theme';

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
      const response = await groupService.createGroup(userId, formData);
      setFormData({ name: '', description: '' });
      if (onGroupCreated) onGroupCreated();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)' }}>
      <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text, mb: 2 }}>
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
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              bgcolor: COLORS.fieldBg,
              color: COLORS.text,
              fontFamily: 'Inter, sans-serif',
              '& fieldset': { borderColor: COLORS.fieldBorder },
              '&:hover fieldset': { borderColor: COLORS.goldSoft },
              '&.Mui-focused fieldset': { borderColor: COLORS.gold, borderWidth: '1px' },
            },
            '& .MuiInputLabel-root': {
              color: COLORS.textFaint,
              fontFamily: 'Inter, sans-serif',
              '&.Mui-focused': { color: COLORS.gold },
            },
          }}
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
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              bgcolor: COLORS.fieldBg,
              color: COLORS.text,
              fontFamily: 'Inter, sans-serif',
              '& fieldset': { borderColor: COLORS.fieldBorder },
              '&:hover fieldset': { borderColor: COLORS.goldSoft },
              '&.Mui-focused fieldset': { borderColor: COLORS.gold, borderWidth: '1px' },
            },
            '& .MuiInputLabel-root': {
              color: COLORS.textFaint,
              fontFamily: 'Inter, sans-serif',
              '&.Mui-focused': { color: COLORS.gold },
            },
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            background: `linear-gradient(90deg, ${COLORS.gold}, #E8C766)`,
            color: '#0A0E17',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '10px',
            boxShadow: `0 8px 24px -8px ${COLORS.goldSoft}`,
            '&:hover': {
              background: `linear-gradient(90deg, #E8C766, ${COLORS.gold})`,
              transform: 'translateY(-1px)',
              boxShadow: `0 12px 28px -8px ${COLORS.goldSoft}`,
            },
          }}
        >
          Create Group
        </Button>
      </Box>
    </Paper>
  );
}

export default GroupForm;
