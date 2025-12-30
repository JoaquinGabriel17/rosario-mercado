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
// Si mañana cambias de DB, solo este archivo cambia.