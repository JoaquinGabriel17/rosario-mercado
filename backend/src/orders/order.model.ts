import { Schema, model, Types, Document } from "mongoose";

export type OrderStatus =
  | "draft"
  | "pending_payment"
  | "paid"
  | "rejected"
  | "shipped"
  | "completed"
  | "failed"
  | "cancelled"
  | "expired";

export interface IOrderItem {
  productId: Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentProvider: "mercadopago";
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending_payment", "draft", "rejected", "shipped", "completed" ,"paid", "failed", "cancelled", "expired"],
      default: "draft",
    },
    paymentProvider: {
      type: String,
      enum: ["mercadopago"]
    },
    paymentId: {
      type: String,
      index: true,
    },
    expiresAt:{
      type: Date,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Order = model<IOrder>("Order", OrderSchema);
