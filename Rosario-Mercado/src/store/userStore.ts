import { create } from "zustand";

interface User {
  id: string;
  username: string;
  email: string;
  token: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user")!)
    : null,

  setUser: (user) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    sessionStorage.removeItem("user");
    set({ user: null });
  }
}));
