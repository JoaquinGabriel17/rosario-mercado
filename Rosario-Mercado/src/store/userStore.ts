import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

interface UserState {
  user: User | null;
  setUser: (data: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (data) => set({ user: data }),

      logout: () => set({ user: null }),
    }),
    {
      name: "user-storage", // nombre en localStorage
    }
  )
);
