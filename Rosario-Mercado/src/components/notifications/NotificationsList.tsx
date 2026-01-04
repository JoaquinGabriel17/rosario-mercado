import { useNotificationStore } from '../../store/notificationsStore';
import { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';

const NotificationList = () => {
  // Obtenemos las notificaciones del store
  const notifications = useNotificationStore((state) => state.notifications);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    
    markAllNotificationsAsReadOnServer();
    markAllAsRead();
    
  }, []);

  const markAllNotificationsAsReadOnServer = async () => {
    try {
      const response = await fetch(`${backendUrl}/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (!response.ok) {
        console.error('Error marking notifications as read on server');
      }
    } catch (error) {
      console.error('Error marking notifications as read on server:', error);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Mis Notificaciones</h2>
      
      {notifications.length === 0 ? (
        <p className="text-gray-500">No tienes notificaciones nuevas.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li 
              key={notification._id} 
              className={`border p-4 rounded-lg shadow-sm transition hover:shadow-md ${
                notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {notification.title}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <a
                  href={notification.link}
                  target="_blank"
                  rel="noopener noreferrer" // Importante para seguridad al usar target="_blank"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                >
                  Ver detalle
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;