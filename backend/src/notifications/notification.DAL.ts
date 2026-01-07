import { Notification } from "./notification.model";

export class NotificationDAL {
  async create(notificationData: any) {
    return await Notification.create(notificationData);
  };
  async findByUserId(userId: string) {
    return await Notification.find({ user: userId }).sort({ createdAt: -1 });
  };
  async markAllAsRead(userId: string) {
    return await Notification.updateMany({ user: userId, read: false }, { read: true });
  };
  async deleteTwoDaysLater(){
    await Notification.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }});
  }
};

