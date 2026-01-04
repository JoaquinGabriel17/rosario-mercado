import { Notification } from "./notification.model";

export class NotificationDAL {
  async create(notificationData: any) {
    return await Notification.create(notificationData);
  };
  async findByUserId(userId: string) {
    return await Notification.find({ user: userId }).sort({ createdAt: -1 });
  };
};

