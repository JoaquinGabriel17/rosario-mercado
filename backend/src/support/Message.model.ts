import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
  ticketId: Types.ObjectId; // referencia al ticket
  senderId: string;         // usuario o admin
  message: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
    senderId: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Message = model<IMessage>("Message", messageSchema);