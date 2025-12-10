import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description?: string;
  price: number;
  category: string;
  imageUrl: string;
  imageId: string;
  userId: string;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true }, 
    imageId: { type: String, required: true },
    userId: { type: String, required: true } 
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
