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

//    const logout = useUserStore((state) => state.logout);
