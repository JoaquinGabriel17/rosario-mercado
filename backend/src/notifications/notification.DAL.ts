import { Notification } from "./notification.model";

export class NotificationDAL {
  async create(notificationData: any) {
    return await Notification.create(notificationData);
  };
};

