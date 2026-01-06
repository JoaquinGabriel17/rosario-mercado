import { Schema, model, Types } from "mongoose";

interface OrderItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface OrderDocument {
  status: "pending" | "completed" | "expired" | "cancelled";
  items: OrderItem[];
  expiresAt: Date;
  createdAt: Date;
  _id: Types.ObjectId;
  buyerId: Types.ObjectId;
  sellerId: String;
}

const OrderSchema = new Schema<OrderDocument>(
  {
    status: {
      type: String,
      enum: ["pending", "completed", "expired", "cancelled"],
      default: "pending",
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
    buyerId: { type: Schema.Types.ObjectId, required: true, index: true },
    sellerId: { type: String, required: true, index: true },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Order = model<OrderDocument>("Order", OrderSchema);
