import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Card, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, CircularProgress, GlobalStyles } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchBudgets, addBudget, updateBudget, deleteBudget } from '../redux/slices/budgetSlice';
import { useToast } from '../components/common/Toast';
import { formatCurrency } from '../utils/currencyFormatter';
import { COLORS } from '../theme';

const BudgetsPage = () => {
    const dispatch = useDispatch();
    const { success, error } = useToast();

    // FIX: guard against budgets ever being undefined/null/non-array.
    // Root cause was a mismatch between what the API returns and what the
    // reducer stores (see budgetSlice.js) — this line is a safety net so the
    // UI never crashes even if that mismatch reappears in the future.
    const { budgets: rawBudgets, loading } = useSelector((state) => state.budgets);
    const budgets = Array.isArray(rawBudgets) ? rawBudgets : [];

    const { userId } = useSelector((state) => state.auth);
    const { expenses: rawExpenses } = useSelector((state) => state.expenses);
    const expenses = Array.isArray(rawExpenses) ? rawExpenses : [];

    const [open, setOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [formData, setFormData] = useState({
        categoryId: '',
        limitAmount: '',
        alertPercentage: 80,
        period: 'MONTHLY'
    });

    useEffect(() => {
        if (userId) {
            dispatch(fetchBudgets(userId));
        }
    }, [dispatch, userId]);

    const handleOpen = (budget = null) => {
        if (budget) {
            setEditingBudget(budget);
            setFormData({
                categoryId: budget.categoryId,
                limitAmount: budget.limitAmount,
                alertPercentage: budget.alertPercentage || 80,
                period: budget.period || 'MONTHLY'
            });
        } else {
            setEditingBudget(null);
            setFormData({
                categoryId: '',
                limitAmount: '',
                alertPercentage: 80,
                period: 'MONTHLY'
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingBudget(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.categoryId || !formData.limitAmount) {
            error('Please fill all required fields');
            return;
        }

        const budgetData = {
            categoryId: parseInt(formData.categoryId),
            limitAmount: parseFloat(formData.limitAmount),
            alertPercentage: parseInt(formData.alertPercentage),
            period: formData.period
        };

        try {
            if (editingBudget) {
                await dispatch(updateBudget({ budgetId: editingBudget.id, budgetData })).unwrap();
                success('Budget updated successfully');
            } else {
                await dispatch(addBudget({ userId, budgetData })).unwrap();
                success('Budget added successfully');
            }
            handleClose();
            dispatch(fetchBudgets(userId));
        } catch (err) {
            console.error('Budget operation error:', err);
            error(editingBudget ? 'Failed to update budget' : 'Failed to add budget');
        }
    };

    const handleDelete = async (budgetId) => {
        if (!window.confirm('Are you sure you want to delete this budget?')) {
            return;
        }

        try {
            await dispatch(deleteBudget(budgetId)).unwrap();
            success('Budget deleted successfully');
            dispatch(fetchBudgets(userId));
        } catch (err) {
            console.error('Budget delete error:', err);
            error('Failed to delete budget');
        }
    };

    const getBudgetProgress = (budget) => {
        const spent = expenses
            .filter(exp => exp.categoryId === budget.categoryId)
            .reduce((sum, exp) => sum + (exp.amount || 0), 0);
        const percentage = budget.limitAmount > 0 ? (spent / budget.limitAmount) * 100 : 0;
        return { spent, percentage };
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 85) return COLORS.red;
        if (percentage >= 60) return COLORS.amber;
        return COLORS.emerald;
    };

    if (loading && budgets.length === 0) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
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
                    maxWidth: 1400,
                    mx: 'auto',
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
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                        <Typography variant="h2" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text }}>
                            Budgets
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpen()}
                            sx={{
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
                            Add Budget
                        </Button>
                    </Box>

                    <Box display="flex" flexDirection="column" gap={3}>
                        {budgets.length > 0 ? (
                            budgets.map((budget) => {
                                const { spent, percentage } = getBudgetProgress(budget);
                                const remaining = budget.limitAmount - spent;
                                const progressColor = getProgressColor(percentage);

                                return (
                                    <Card
                                        key={budget.id}
                                        sx={{
                                            p: 3,
                                            bgcolor: COLORS.panel,
                                            backdropFilter: 'blur(20px)',
                                            border: `1px solid ${COLORS.panelBorder}`,
                                            borderRadius: '16px',
                                            boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)',
                                            position: 'relative',
                                        }}
                                    >
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text }}>
                                                    {budget.category?.name || 'Category'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
                                                    {budget.period}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" gap={1}>
                                                <IconButton onClick={() => handleOpen(budget)} size="small" sx={{ color: COLORS.textDim, '&:hover': { color: COLORS.gold } }}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleDelete(budget.id)} size="small" sx={{ color: COLORS.textDim, '&:hover': { color: COLORS.red } }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>
                                                Spent: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{formatCurrency(spent)}</span>
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'JetBrains Mono, monospace' }}>
                                                Limit: {formatCurrency(budget.limitAmount)}
                                            </Typography>
                                        </Box>

                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min(percentage, 100)}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: 'rgba(255,255,255,0.08)',
                                                mb: 1,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: progressColor,
                                                    borderRadius: 4,
                                                },
                                            }}
                                        />

                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="caption" sx={{ color: progressColor, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>
                                                {percentage.toFixed(1)}% used
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: remaining >= 0 ? COLORS.emerald : COLORS.red,
                                                    fontWeight: 600,
                                                    fontFamily: 'JetBrains Mono, monospace',
                                                }}
                                            >
                                                {remaining >= 0 ? `${formatCurrency(remaining)} remaining` : `${formatCurrency(Math.abs(remaining))} over`}
                                            </Typography>
                                        </Box>
                                    </Card>
                                );
                            })
                        ) : (
                            <Card sx={{ p: 6, bgcolor: COLORS.panel, backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.panelBorder}`, borderRadius: '16px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)', textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: COLORS.textDim, fontFamily: 'Inter, sans-serif' }}>
                                    No budgets yet. Create your first budget to start tracking your spending!
                                </Typography>
                            </Card>
                        )}
                    </Box>

                    <Dialog
                        open={open}
                        onClose={handleClose}
                        maxWidth="sm"
                        fullWidth
                        PaperProps={{
                            sx: {
                                backgroundColor: COLORS.panel,
                                backdropFilter: 'blur(20px)',
                                border: `1px solid ${COLORS.panelBorder}`,
                                borderRadius: '16px',
                            },
                        }}
                    >
                        <DialogTitle sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: COLORS.text }}>
                            {editingBudget ? 'Edit Budget' : 'Add Budget'}
                        </DialogTitle>
                        <DialogContent>
                            <Box component="form" sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Category"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    margin="normal"
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
                                        '& .MuiSelect-icon': { color: COLORS.textDim },
                                    }}
                                >
                                    {/*
                FIX NOTE: these were hardcoded IDs (1-5) guessing at your
                categories table. Now that you've seeded real categories
                (ids 1-8 for EXPENSE type), these happen to line up, but
                this is fragile — see the note below the component for how
                to load these dynamically from categoryService instead.
              */}
                                    <MenuItem value="" sx={{ color: COLORS.text }}>Select Category</MenuItem>
                                    <MenuItem value="1" sx={{ color: COLORS.text }}>Food</MenuItem>
                                    <MenuItem value="2" sx={{ color: COLORS.text }}>Transport</MenuItem>
                                    <MenuItem value="3" sx={{ color: COLORS.text }}>Rent</MenuItem>
                                    <MenuItem value="4" sx={{ color: COLORS.text }}>Entertainment</MenuItem>
                                    <MenuItem value="5" sx={{ color: COLORS.text }}>Shopping</MenuItem>
                                    <MenuItem value="6" sx={{ color: COLORS.text }}>Utilities</MenuItem>
                                    <MenuItem value="7" sx={{ color: COLORS.text }}>Health</MenuItem>
                                    <MenuItem value="8" sx={{ color: COLORS.text }}>Other</MenuItem>
                                </TextField>
                                <TextField
                                    fullWidth
                                    label="Monthly Limit"
                                    type="number"
                                    value={formData.limitAmount}
                                    onChange={(e) => setFormData({ ...formData, limitAmount: e.target.value })}
                                    margin="normal"
                                    required
                                    inputProps={{ min: 0, step: 0.01 }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '10px',
                                            bgcolor: COLORS.fieldBg,
                                            color: COLORS.text,
                                            fontFamily: 'JetBrains Mono, monospace',
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
                                    label="Alert Threshold (%)"
                                    type="number"
                                    value={formData.alertPercentage}
                                    onChange={(e) => setFormData({ ...formData, alertPercentage: e.target.value })}
                                    margin="normal"
                                    inputProps={{ min: 0, max: 100, step: 1 }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '10px',
                                            bgcolor: COLORS.fieldBg,
                                            color: COLORS.text,
                                            fontFamily: 'JetBrains Mono, monospace',
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
                                    select
                                    label="Period"
                                    value={formData.period}
                                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                    margin="normal"
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
                                        '& .MuiSelect-icon': { color: COLORS.textDim },
                                    }}
                                >
                                    <MenuItem value="MONTHLY" sx={{ color: COLORS.text }}>Monthly</MenuItem>
                                    <MenuItem value="YEARLY" sx={{ color: COLORS.text }}>Yearly</MenuItem>
                                </TextField>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleClose}
                                sx={{
                                    color: COLORS.textDim,
                                    fontFamily: 'Inter, sans-serif',
                                    '&:hover': {
                                        backgroundColor: 'rgba(212, 175, 55, 0.08)',
                                        color: COLORS.text,
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                sx={{
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
                                {editingBudget ? 'Update' : 'Add'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </>
    );
};

export default BudgetsPage;