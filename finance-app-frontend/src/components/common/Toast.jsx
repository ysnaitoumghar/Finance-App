import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';
import { COLORS } from '../../theme';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, options = {}) => {
    const id = Date.now();
    const toast = {
      id,
      message,
      severity: options.severity || 'success',
      duration: options.duration || 4000,
      position: options.position || { vertical: 'bottom', horizontal: 'right' },
    };

    setToasts((prev) => [...prev, toast]);

    if (toast.duration !== null) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, options) => showToast(message, { ...options, severity: 'success' }), [showToast]);
  const error = useCallback((message, options) => showToast(message, { ...options, severity: 'error' }), [showToast]);
  const warning = useCallback((message, options) => showToast(message, { ...options, severity: 'warning' }), [showToast]);
  const info = useCallback((message, options) => showToast(message, { ...options, severity: 'info' }), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info, removeToast }}>
      {children}
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open={true}
          anchorOrigin={toast.position}
          TransitionComponent={Slide}
          onClose={() => removeToast(toast.id)}
        >
          <Alert
            onClose={() => removeToast(toast.id)}
            severity={toast.severity}
            variant="filled"
            sx={{
              minWidth: 300,
              backgroundColor: toast.severity === 'success' ? COLORS.emerald :
                             toast.severity === 'error' ? COLORS.red :
                             toast.severity === 'warning' ? COLORS.amber : COLORS.panel,
              color: toast.severity === 'info' ? COLORS.text : '#0A0E17',
              fontFamily: 'Inter, sans-serif',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${COLORS.panelBorder}`,
              '& .MuiAlert-icon': {
                color: toast.severity === 'info' ? COLORS.gold : 'inherit',
              },
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
};
