'use client';

import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

let toastIdCounter = 0;
let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toastState: Toast[] = [];

const notifyListeners = () => {
  toastListeners.forEach((listener) => listener([...toastState]));
};

export const toast = {
  show: (message: string, type: ToastType = 'info') => {
    const id = `toast-${toastIdCounter++}`;
    const newToast: Toast = { id, message, type };
    toastState.push(newToast);
    notifyListeners();

    // Auto remove after 5 seconds
    setTimeout(() => {
      toastState = toastState.filter((t) => t.id !== id);
      notifyListeners();
    }, 5000);
  },
  success: (message: string) => toast.show(message, 'success'),
  error: (message: string) => toast.show(message, 'error'),
  warning: (message: string) => toast.show(message, 'warning'),
  info: (message: string) => toast.show(message, 'info'),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setToasts(newToasts);
    };
    toastListeners.push(listener);
    setToasts([...toastState]);

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-orange-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} px-6 py-4 rounded-lg shadow-lg min-w-[300px] max-w-md flex items-center justify-between animate-in slide-in-from-right`}
        >
          <p className="flex-1">{toast.message}</p>
          <button
            onClick={() => {
              toastState = toastState.filter((t) => t.id !== toast.id);
              notifyListeners();
            }}
            className="ml-4 text-white hover:text-gray-200 font-bold"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
