import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'error' | 'gold';
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'error' | 'gold', duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((
    title: string,
    message?: string,
    type: 'success' | 'info' | 'error' | 'gold' = 'gold',
    duration = 4500
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: ToastItem = { id, title, message, type, duration };

    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
