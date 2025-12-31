import { Schema, model, Document } from "mongoose";

export interface ITicket extends Document {
  userId: string; // referencia al usuario que abre el ticket
  title: string;
  status: "open" | "in_progress" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export const Ticket = model<ITicket>("Ticket", ticketSchema);