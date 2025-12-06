import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  userId: string;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String }], 
    userId: { type: String, required: true } 
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
