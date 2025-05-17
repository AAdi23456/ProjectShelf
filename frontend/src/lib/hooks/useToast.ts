import { toast } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const defaultToastOptions: ToastOptions = {
  duration: 3000, // 3 seconds auto-dismiss
  position: 'top-right',
};

/**
 * Custom hook for consistent toast notifications
 * This provides a standardized way to show toasts across the application
 */
export function useToast() {
  const showToast = (
    message: string,
    type: ToastType = 'info',
    options: ToastOptions = {}
  ) => {
    const mergedOptions = { ...defaultToastOptions, ...options };
    
    switch (type) {
      case 'success':
        return toast.success(message, mergedOptions);
      case 'error':
        return toast.error(message, mergedOptions);
      case 'warning':
        return toast.warning(message, mergedOptions);
      case 'info':
      default:
        return toast.info(message, mergedOptions);
    }
  };

  const authError = (errorMsg: string = 'Invalid email or password') => {
    return showToast(errorMsg, 'error', {
      description: 'Please check your credentials and try again.',
    });
  };

  const authSuccess = (message: string = 'Authentication successful') => {
    return showToast(message, 'success');
  };

  return {
    showToast,
    authError,
    authSuccess,
    toast, // Re-export the original toast for direct access
  };
} 