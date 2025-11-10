import React, { useState, useEffect } from 'react';
import { notificationApi } from '@/entities/notification/api/notificationApi';
import { Notification } from '@/entities/notification/model/types';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await notificationApi.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    };

    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    // Note: The BFF contract doesn't provide a markAsRead endpoint
    // Update local state only for now
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Notificações</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-600 text-center">Nenhuma notificação</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  <p className="text-xs text-gray-600">{notification.message}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString('pt-BR')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
