import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../components/notifications/NotificationCenter';
import { ToastType } from '../components/notifications/ToastNotification';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  toasts: Toast[];
  showNotificationCenter: boolean;
  toggleNotificationCenter: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => void;
  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  toasts: [],
  showNotificationCenter: false,
  toggleNotificationCenter: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearAllNotifications: () => {},
  addNotification: () => {},
  showToast: () => {},
  dismissToast: () => {},
});

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(parsedNotifications);
      } catch (error) {
        console.error('Error parsing saved notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage when changed
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleNotificationCenter = () => {
    setShowNotificationCenter(!showNotificationCenter);
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => {
    const newNotification: Notification = {
      id: uuidv4(),
      ...notification,
      isRead: false,
      timestamp: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const newToast: Toast = {
      id: uuidv4(),
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        toasts,
        showNotificationCenter,
        toggleNotificationCenter,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        addNotification,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};