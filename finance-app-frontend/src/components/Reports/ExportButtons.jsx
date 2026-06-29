import React, { useState } from 'react';
import { Box, Button, CircularProgress, useTheme } from '@mui/material';
import { PictureAsPdf, TableChart } from '@mui/icons-material';
import { exportToPDF, exportToCSV } from '../../services/exportService';
import { prepareSummaryCSV } from '../../services/exportService';
import { format } from 'date-fns';

const ExportButtons = ({ data, reportRef, type = 'summary' }) => {
  const theme = useTheme();
  const [exporting, setExporting] = useState(null);

  const handlePDFExport = async () => {
    if (!reportRef) return;
    
    setExporting('pdf');
    try {
      const filename = `finance-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      const success = await exportToPDF(reportRef.current, filename);
      if (success) {
        alert('PDF exported successfully!');
      } else {
        alert('Failed to export PDF');
      }
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF');
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
        alert('CSV exported successfully!');
      } else {
        alert('Failed to export CSV');
      }
    } catch (error) {
      console.error('CSV export error:', error);
      alert('Failed to export CSV');
    } finally {
      setExporting(null);
    }
  };

  return (
    <Box display="flex" gap={2}>
      <Button
        variant="outlined"
        startIcon={exporting === 'pdf' ? <CircularProgress size={20} /> : <PictureAsPdf />}
        onClick={handlePDFExport}
        disabled={exporting !== null}
        sx={{
          borderColor: theme.palette.error.main,
          color: theme.palette.error.main,
          '&:hover': {
            borderColor: theme.palette.error.dark,
            bgcolor: `${theme.palette.error.main}10`
          }
        }}
      >
        Export PDF
      </Button>
      
      <Button
        variant="outlined"
        startIcon={exporting === 'csv' ? <CircularProgress size={20} /> : <TableChart />}
        onClick={handleCSVExport}
        disabled={exporting !== null}
        sx={{
          borderColor: theme.palette.success.main,
          color: theme.palette.success.main,
          '&:hover': {
            borderColor: theme.palette.success.dark,
            bgcolor: `${theme.palette.success.main}10`
          }
        }}
      >
        Export CSV
      </Button>
    </Box>
  );
};

export default ExportButtons;
