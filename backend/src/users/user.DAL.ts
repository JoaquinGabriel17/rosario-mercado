import User from "./User.model";

export const findByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const findByName = async (name: string) => {
  return await User.findOne({ name });
};

export const create = async (data: any) => {
  return await User.create(data);
};

export const updateUser = async (userId: string, updates: any) => {
  return await User.findByIdAndUpdate(userId, updates, { new: true });
};
// Si mañana cambias de DB, solo este archivo cambia.