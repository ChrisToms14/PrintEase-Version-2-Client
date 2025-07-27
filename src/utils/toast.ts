export type Toast = {
  id: string;
  title?: string;
  description?: string;
  type?: 'default' | 'success' | 'error';
  duration?: number;
};

type ToastHandler = (toast: Toast) => void;

let handlers: ToastHandler[] = [];

export function subscribe(handler: ToastHandler) {
  handlers.push(handler);
  
  return () => {
    handlers = handlers.filter((h) => h !== handler);
  };
}

export function showToast(toast: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).substring(2, 9);
  const duration = toast.duration || 5000;
  
  handlers.forEach((handler) => handler({ ...toast, id, duration }));
}