import { getIO } from "../config/socket";
import { NotificationDAL } from "../notifications/notification.DAL";

const notificationDal = new NotificationDAL();

export async function sendNotification(notificationData: any) {
    try {
        // Crear notificación en BD
        const newNotification = await notificationDal.create(notificationData);

        // Emitir notificación en tiempo real vía Socket.io
        const io = await getIO();
        await io.to(notificationData.user).emit('new_notification', newNotification);
    } catch (error) {
        console.error("Error enviando socket:", error);
    }
    
} 