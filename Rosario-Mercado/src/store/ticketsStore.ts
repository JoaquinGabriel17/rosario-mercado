// src/store/ticketsStore.ts
import { create } from "zustand";

export interface Ticket {
  id: string;
  userId: string;
  title: string;
  status: "open" | "closed" | "in_progress";
  createdAt: string;
  updatedAt: string;
}

interface TicketsState {
  openTickets: Ticket[];
  setOpenTickets: (tickets: Ticket[]) => void;
}

export const useTicketsStore = create<TicketsState>((set) => ({
  openTickets: [],
  setOpenTickets: (tickets) => set({ openTickets: tickets }),
}));