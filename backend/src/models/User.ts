import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  businessHours?: string;     // horario de atención
  address?: string;           // dirección
  whatsappAvailable?: boolean;
  delivery?: boolean;
  isSeller: boolean;
  facebookUrl?: string;
  instagramUrl?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    phoneNumber: { type: String },
    businessHours: { type: String },       // horario de atención
    address: { type: String },

    whatsappAvailable: { type: Boolean, default: false },
    delivery: { type: Boolean, default: false },
    isSeller: { type: Boolean, default: false, required: true},
    facebookUrl: { type: String },
    instagramUrl: { type: String },
    
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
