import React, { useState } from 'react';
import { X, Bell, Check, MailOpen } from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'contribution' | 'system' | 'account';
  isRead: boolean;
  timestamp: Date;
}

interface NotificationCenterProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(notif => !notif.isRead);
  
  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return <div className="p-2 bg-green-100 rounded-full"><Bell className="w-5 h-5 text-green-600" /></div>;
      case 'system':
        return <div className="p-2 bg-blue-100 rounded-full"><Bell className="w-5 h-5 text-blue-600" /></div>;
      case 'account':
        return <div className="p-2 bg-yellow-100 rounded-full"><Bell className="w-5 h-5 text-yellow-600" /></div>;
      default:
        return <div className="p-2 bg-gray-100 rounded-full"><Bell className="w-5 h-5 text-gray-600" /></div>;
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose}></div>
      )}
      
      <div 
        className={`fixed right-0 top-0 h-screen w-full md:w-96 bg-white shadow-lg z-50 transition-transform transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {unreadCount} new
              </span>
            )}
          </div>
          <button 
            className="p-1 hover:bg-gray-100 rounded-full"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Toolbar */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <div className="space-x-2">
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
          </div>
          <div className="space-x-2">
            <button 
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={onMarkAllAsRead}
            >
              Mark all as read
            </button>
            <button 
              className="text-sm text-red-600 hover:text-red-800"
              onClick={onClearAll}
            >
              Clear all
            </button>
          </div>
        </div>
        
        {/* Notification List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
              <MailOpen className="w-12 h-12 mb-4" />
              <p className="mb-1">No notifications</p>
              <p className="text-sm">
                {filter === 'all' 
                  ? "You don't have any notifications yet." 
                  : "You don't have any unread notifications."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <li 
                  key={notification.id} 
                  className={`p-4 hover:bg-gray-50 ${notification.isRead ? '' : 'bg-blue-50'}`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <button 
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                        onClick={() => onMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;