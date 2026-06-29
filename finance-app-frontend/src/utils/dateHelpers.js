import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears, format } from 'date-fns';

export const getDateRanges = () => {
  const now = new Date();
  
  return {
    thisMonth: {
      start: startOfMonth(now),
      end: endOfMonth(now),
      label: 'This Month'
    },
    lastMonth: {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
      label: 'Last Month'
    },
    last3Months: {
      start: startOfMonth(subMonths(now, 3)),
      end: endOfMonth(now),
      label: 'Last 3 Months'
    },
    last6Months: {
      start: startOfMonth(subMonths(now, 6)),
      end: endOfMonth(now),
      label: 'Last 6 Months'
    },
    thisYear: {
      start: startOfYear(now),
      end: endOfYear(now),
      label: 'This Year'
    },
    lastYear: {
      start: startOfYear(subYears(now, 1)),
      end: endOfYear(subYears(now, 1)),
      label: 'Last Year'
    }
  };
};

export const formatDate = (date) => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date) => {
  return format(date, 'MMM dd, yyyy');
};

export const getMonthName = (date) => {
  return format(date, 'MMMM yyyy');
};

export const compareWithPrevious = (current, previous) => {
  if (previous === 0) return { value: 0, percentage: 0, trend: 'neutral' };
  
  const difference = current - previous;
  const percentage = ((difference / previous) * 100).toFixed(1);
  
  return {
    value: difference,
    percentage: parseFloat(percentage),
    trend: difference > 0 ? 'up' : difference < 0 ? 'down' : 'neutral'
  };
};
