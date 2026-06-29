import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';

export const exportToPDF = async (element, filename = 'finance-report.pdf') => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    return false;
  }
};

export const exportToCSV = (data, filename = 'finance-report.csv') => {
  try {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('CSV export failed:', error);
    return false;
  }
};

export const prepareTransactionCSV = (transactions) => {
  return transactions.map(t => ({
    Date: t.date,
    Description: t.description,
    Category: t.category,
    Amount: t.amount,
    Type: t.type
  }));
};

export const prepareSummaryCSV = (summary) => {
  return [
    {
      Metric: 'Total Income',
      Value: summary.income
    },
    {
      Metric: 'Total Expenses',
      Value: summary.expenses
    },
    {
      Metric: 'Net Savings',
      Value: summary.savings
    },
    {
      Metric: 'Budget Remaining',
      Value: summary.budgetRemaining
    }
  ];
};
