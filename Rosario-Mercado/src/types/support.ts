import { z } from 'zod';

export interface TicketFormData {
  title: string;
  description: string;
}

export interface Message {
  _id: string;
  ticketId: string;
  senderId: string;
  message: string;
  createdAt: string;
}

export const TicketSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  title: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Ticket = z.infer<typeof TicketSchema>;
export interface TicketItemProps {
  ticket: Ticket;
  onClick: (id: string) => void;
}
export const TicketsArraySchema = z.array(TicketSchema);

 