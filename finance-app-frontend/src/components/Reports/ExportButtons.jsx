import React, { useState } from 'react';
import { Box, Button, CircularProgress, useTheme, alpha } from '@mui/material';
import { PictureAsPdf, TableChart } from '@mui/icons-material';
import { exportToPDF, exportToCSV } from '../../services/exportService';
import { prepareSummaryCSV } from '../../services/exportService';
import { format } from 'date-fns';
import { useToast } from '../common/Toast';

const ExportButtons = ({ data, reportRef, type = 'summary' }) => {
  const theme = useTheme();
  const { success, error } = useToast();
  const [exporting, setExporting] = useState(null);

  const handlePDFExport = async () => {
    if (!reportRef) {
      error('Report preview not available');
      return;
    }
    
    setExporting('pdf');
    try {
      const filename = `finance-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      const success = await exportToPDF(reportRef.current, filename);
      if (success) {
        success('PDF exported successfully!');
      } else {
        error('Failed to export PDF');
      }
    } catch (err) {
      console.error('PDF export error:', err);
      error('Failed to export PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setExporting(null);
    }
  };

  const handleCSVExport = () => {
    setExporting('csv');
    try {
      const csvData = type === 'summary' 
        ? prepareSummaryCSV(data)
        : data;
      
      const filename = `finance-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      const success = exportToCSV(csvData, filename);
      
      if (success) {
        success('CSV exported successfully!');
      } else {
        error('Failed to export CSV');
      }
    } catch (err) {
      console.error('CSV export error:', err);
      error('Failed to export CSV: ' + (err.message || 'Unknown error'));
    } finally {
      setExporting(null);
    }
  };

  return (
    <Box display="flex" gap={2}>
      <Button
        variant="contained"
        startIcon={exporting === 'pdf' ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdf />}
        onClick={handlePDFExport}
        disabled={exporting !== null}
        sx={{
          bgcolor: theme.palette.error.main,
          color: 'white',
          '&:hover': {
            bgcolor: theme.palette.error.dark,
          },
          '&:disabled': {
            bgcolor: alpha(theme.palette.error.main, 0.5),
          }
        }}
      >
        {exporting === 'pdf' ? 'Exporting...' : 'Export PDF'}
      </Button>
      
      <Button
        variant="contained"
        startIcon={exporting === 'csv' ? <CircularProgress size={20} color="inherit" /> : <TableChart />}
        onClick={handleCSVExport}
        disabled={exporting !== null}
        sx={{
          bgcolor: theme.palette.success.main,
          color: 'white',
          '&:hover': {
            bgcolor: theme.palette.success.dark,
          },
          '&:disabled': {
            bgcolor: alpha(theme.palette.success.main, 0.5),
          }
        }}
      >
        {exporting === 'csv' ? 'Exporting...' : 'Export CSV'}
      </Button>
    </Box>
  );
};

export default ExportButtons;
