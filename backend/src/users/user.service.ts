import * as UserDAL from "./user.DAL";
import { AppError } from "../utils/appError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { resend } from "../config/resend";

export const registerUser = async (userData: any) => {
  const emailExists = await UserDAL.findByEmail(userData.email);
  if (emailExists) throw new AppError("El email ya está registrado", 400);

  const nameExists = await UserDAL.findByName(userData.name);
  if(nameExists) throw new AppError("El nombre de usuario ya existe", 400);

  const hashed = await bcrypt.hash(userData.password, 10);
  return await UserDAL.create({ ...userData, password: hashed });
};

export const loginUser = async (email: string, password: string) => {
    const user = await UserDAL.findByEmail(email);
    if (!user) throw new AppError("Credenciales incorrectas", 404);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new AppError("Credenciales incorrectas", 401);

    const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    return { user, token };
}

export const updateUserInfo = async (userId: string, updates: any) => {
    // Validar email duplicado
    if (updates.email) {
      const emailExists = await UserDAL.findByEmail(updates.email); 
      if (emailExists && emailExists._id.toString() !== userId) throw new AppError("El email ya está registrado", 400);
    }

    // Validar nombre duplicado
    if (updates.name) {
      const nameExists = await UserDAL.findByName(updates.name);
      if (nameExists && nameExists._id.toString() !== userId) throw new AppError("El nombre de usuario ya existe", 400);
    }

    return await UserDAL.update(userId, updates);
}

export const sendResetPasswordEmail = async (email: string) => {
    
    const user = await UserDAL.findByEmail(email);

    if (!user) throw new AppError("Dirección de correo electrónico no registrada", 404);

    // Crear token temporal (30 minutos)
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_RESET_SECRET!,
        { expiresIn: "30m" }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await resend.emails.send({
        from: 'Agora <onboarding@resend.dev>',
        to: email,
        subject: "Recuperar contraseña - Agora",
        html: `
            <p>Para recuperar tu contraseña de Agora, hacé clic en el siguiente enlace:</p>
            <a href="${resetLink}" target="_blank">${resetLink}</a>
            <p>Este enlace expira en 20 minutos.</p>
          `
    });
}

export const resetUserPassword = async (token: string, password: string) => {

     // Verificar token
        const decoded: any = jwt.verify(token, process.env.JWT_RESET_SECRET!);
    
        const user = await UserDAL.findById(decoded.id);
    
        if (!user) throw new AppError("Usuario no encontrado", 404);
    
        // Guardar contraseña hasheada
        const salt = await bcrypt.genSalt(10);
        await UserDAL.updatePassword(decoded.id, await bcrypt.hash(password, salt));
}