'use client';

import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
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
    <div className="fixed bottom-4 left-4 right-4 md:bottom-auto md:top-6 md:right-6 md:left-auto z-[100] space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} px-5 py-4 rounded-2xl shadow-2xl w-full md:w-[400px] flex items-center justify-between pointer-events-auto animate-in slide-in-from-bottom md:slide-in-from-right duration-300 border border-white/10 backdrop-blur-md`}
        >
          <div className="flex-1 flex gap-3 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
            <p className="text-sm font-bold tracking-tight leading-tight">{toast.message}</p>
          </div>
          <button
            onClick={() => {
              toastState = toastState.filter((t) => t.id !== toast.id);
              notifyListeners();
            }}
            className="ml-4 w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors shrink-0"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>
      ))}
    </div>
  );
}
