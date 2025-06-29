import React from 'react';
import MonthlyPlanner from '../coordinator/monthlyPlanner';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function TestMonthlyPlanner() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '20px' }}>
        <h1>Monthly Planner Test Page</h1>
        <MonthlyPlanner />
      </div>
    </ThemeProvider>
  );
}

export default TestMonthlyPlanner;
