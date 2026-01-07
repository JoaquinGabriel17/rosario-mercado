import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description?: string;
  price: number;
  category: string;
  imageUrl: string;
  imageId: string;
  userId: Types.ObjectId;
  stock: number;
  soldCount: number;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true }, 
    imageId: { type: String, required: true },
    userId: { type: Types.ObjectId, required: true } ,
    stock: { type: Number, default: 0,required: true},
    soldCount: { type: Number, default: 0, required: true}
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
