import { Schema, model, Types } from "mongoose";

interface OrderItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface OrderDocument {
  status: "pending_payment" | "paid" | "expired" | "rejected" | "cancelled";
  items: OrderItem[];
  expiresAt: Date;
  createdAt: Date;
  _id: Types.ObjectId;
  userId: Types.ObjectId;
}

const OrderSchema = new Schema<OrderDocument>(
  {
    status: {
      type: String,
      enum: ["pending_payment", "paid", "expired", "rejected", "cancelled"],
      default: "pending_payment",
      index: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Order = model<OrderDocument>("Order", OrderSchema);
