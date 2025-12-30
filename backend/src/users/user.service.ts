import * as UserDAL from "./user.DAL";
import { AppError } from "../utils/appError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (userData: any) => {
  const emailExists = await UserDAL.findByEmail(userData.email);
  if (emailExists) throw new AppError("El email ya está registrado", 400);

  const nameExists = await UserDAL.findByName(userData.name);
  if(nameExists) throw new AppError("El nombre de usuario ya existe", 400);

  const hashed = await bcrypt.hash(userData.password, 10);
  return await UserDAL.create({ ...userData, password: hashed });
};

export const loginUser = async (userData: any) => {
  const user = await UserDAL.findByEmail(userData.email);
  if (!user) throw new AppError("Credenciales incorrectas", 401);

  const valid = await bcrypt.compare(userData.password, user.password);
      if (!valid) throw new AppError("Credenciales incorrectas", 401);
      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );
    
    return { user, token };
}

export const updateUserInfo = async (userId: string, updates: any) => {
    const emailExists = await UserDAL.findByEmail(updates.email);
    if (emailExists && emailExists._id.toString() !== userId) throw new AppError("El email ingresado ya está registrado", 400);
    
    const nameExists = await UserDAL.findByName(updates.name);
    if(nameExists && nameExists._id.toString() !== userId) throw new AppError("El nombre de usuario ya existe", 400);

    return await UserDAL.updateUser(userId, updates);
}