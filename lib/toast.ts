/**
 * Toast notification utilities using react-toastify
 * Centralized error, success, warning, and info notifications
 */

import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const notifyError = (message: string, options?: ToastOptions) => {
  toast.error(message, { ...defaultOptions, ...options });
};

export const notifySuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, { ...defaultOptions, autoClose: 3000, ...options });
};

export const notifyWarning = (message: string, options?: ToastOptions) => {
  toast.warning(message, { ...defaultOptions, ...options });
};

export const notifyInfo = (message: string, options?: ToastOptions) => {
  toast.info(message, { ...defaultOptions, ...options });
};

/**
 * Extract user-friendly error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Log error to console and show toast notification
 */
export const handleError = (context: string, error: unknown, showToast = true) => {
  const message = getErrorMessage(error);
  console.error(`[${context}] Error:`, error);
  
  if (showToast) {
    notifyError(message);
  }
  
  return message;
};
