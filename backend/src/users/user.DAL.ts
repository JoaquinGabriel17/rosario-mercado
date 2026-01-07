import { AppError } from "../utils/AppError";
import User from "./User.model";

export const findByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const create = async (data: any) => {
  return await User.create(data);
};

export const findByName = async (name: string) => {
  return await User.findOne({ name });
};

export const update = async (userId: string, updates: any) => {
  return await User.findByIdAndUpdate(userId, updates, { new: true });
};

export const findById = async (userId: string) => {
    return await User.findById(userId);
};

export const updatePassword = async (userId: string, newPassword: string) => {
    return await User.findByIdAndUpdate(userId, { password: newPassword }, { new: true });
};

export const updateMPSellerLink = async(data: any) => {
  const user = await User.findById(data.userId);
  if(!user) throw new AppError("Usuario no encontrado", 404);

  user.mercadoPago = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
      publicKey: data.public_key,
      userId: data.user_id.toString(),
      expiresIn: data.expires_in,
      linkedAt: new Date()
  }

  await user.save();
}
// Si mañana cambias de DB, solo este archivo cambia.