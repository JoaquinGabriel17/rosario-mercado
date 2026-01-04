import { create } from 'zustand';

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface NotificationStore {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  setNotifications: (data) => set({ notifications: data }),
  clearNotifications: () => set({ notifications: [] }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    })),
}));