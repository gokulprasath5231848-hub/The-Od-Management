'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import compStyles from '@/styles/components.module.css';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Return a no-op if outside provider (safety)
    return { showToast: () => {}, success: () => {}, error: () => {}, info: () => {} };
  }
  return ctx;
}

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const STYLE_MAP = {
  success: compStyles.toastSuccess,
  error: compStyles.toastError,
  info: compStyles.toastInfo,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  const api = {
    showToast: (msg, type = 'info') => addToast(msg, type),
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={compStyles.toastContainer}>
        {toasts.map(toast => {
          const Icon = ICONS[toast.type] || Info;
          const styleClass = STYLE_MAP[toast.type] || STYLE_MAP.info;
          return (
            <div
              key={toast.id}
              className={`${compStyles.toast} ${styleClass} ${toast.exiting ? compStyles.toastExiting : ''}`}
            >
              <Icon size={20} className={compStyles.toastIcon} />
              <span className={compStyles.toastMessage}>{toast.message}</span>
              <button className={compStyles.toastClose} onClick={() => removeToast(toast.id)}>
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
