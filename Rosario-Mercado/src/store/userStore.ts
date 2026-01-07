import { create } from "zustand";

//    const user = useUserStore((state) => state.user);


interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  phoneNumber?: string;
  businessHours?: string;
  address?: string;
  whatsappAvailable: boolean;
  delivery: boolean;
  instagramUrl: string;
  facebookUrl: string;
  role: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  }
}));

//    const logout = useUserStore((state) => state.logout);
