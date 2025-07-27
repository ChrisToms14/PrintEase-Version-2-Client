import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Toast, subscribe } from '../../utils/toast';

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  useEffect(() => {
    const unsubscribe = subscribe((toast) => {
      setToasts((prev) => [...prev, toast]);
      
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.duration || 5000);
    });
    
    return () => unsubscribe();
  }, []);
  
  const getIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={18} className="text-red-500" />;
      default:
        return <Info size={18} className="text-blue-500" />;
    }
  };
  
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-4 flex">
              <div className="flex-shrink-0 mr-3">
                {getIcon(toast.type)}
              </div>
              <div className="flex-1">
                {toast.title && (
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{toast.title}</h4>
                )}
                {toast.description && (
                  <p className="text-sm text-gray-600">{toast.description}</p>
                )}
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-500"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
