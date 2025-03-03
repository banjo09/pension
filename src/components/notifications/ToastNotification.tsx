import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastNotificationProps {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  id,
  type,
  message,
  title,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  useEffect(() => {
    if (duration > 0) {
      // Set up the progress bar
      const interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setTimeout(() => setIsVisible(false), 300);
            setTimeout(() => onClose(id), 500);
            return 0;
          }
          return prev - (100 / (duration / 100));
        });
      }, 100);

      setIntervalId(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  const getToastIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getToastBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`max-w-xs p-4 mb-4 rounded-lg shadow-md border ${getToastBgColor()} relative overflow-hidden`}
        role="alert"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">{getToastIcon()}</div>
          <div className="ml-3 w-full pr-6">
            {title && <h3 className="text-sm font-medium text-gray-800">{title}</h3>}
            <div className="text-sm text-gray-700 mt-1">{message}</div>
          </div>
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1"
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div
              className={`h-full ${
                type === 'success'
                  ? 'bg-green-500'
                  : type === 'error'
                  ? 'bg-red-500'
                  : type === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToastNotification;