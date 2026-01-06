import { getIO } from "../config/socket";
import { NotificationDAL } from "../notifications/notification.DAL";

const notificationDal = new NotificationDAL();

export async function sendNotification(notificationData: any) {
    try {
        // Crear notificación en BD
        const newNotification = notificationDal.create(notificationData);

        // Emitir notificación en tiempo real vía Socket.io
        const io = getIO();
        io.to(notificationData.user).emit('new_notification', newNotification);
    } catch (error) {
        console.error("Error enviando socket:", error);
    }
    
} 