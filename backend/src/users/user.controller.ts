import { Request, Response } from "express";
import User from "./User.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middlewares/auth";
import sendEmail from "../utils/sendEmail"; // función que envía correo
import mongoose from "mongoose";
import { resend } from "../config/resend";
import { registerUser, loginUser, updateUserInfo } from "./user.service";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";


// CREAR USUARIO
export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, password, email } = req.body;

  // Validación básica (Capa Web)
  if (!name || !password || !email) {
    throw new AppError("Faltan datos obligatorios", 400);
  }

  const newUser = await registerUser(req.body);

  res.status(201).json({
    message: "Usuario creado correctamente",
    user: newUser,
  });
});

// INICIAR SESION
export const login = catchAsync( async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if(!email || !password) {
      throw new AppError("Faltan datos obligatorios", 400 );
    };
    
    const user = await loginUser(req.body);

    return res.status(200).json({
      message: "Login correcto",
      token: user.token,
      user: user.user,
    });
});


// ACTUALIZAR INFORMACIÓN DE USUARIO
export const updateInfo = catchAsync( async (req: AuthRequest, res: Response) => {
  
    const userId = req.user.id;

    // Campos permitidos
    const allowedFields = [
      "email",
      "name",
      "phoneNumber",
      "address",
      "businessHours",
      "whatsappAvailable",
      "delivery",
      "instagramUrl",
      "facebookUrl",
      "role"
    ];

    // Filtrar los campos enviados en la request
    const updates: Record<string, any> = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Si no se envió ningún campo válido → error
    if (Object.keys(updates).length === 0) throw new AppError("No se envió ningún campo válido para actualizar", 400);

    const updateUser = await updateUserInfo(userId, updates);
    res.status(200).json({
      message: "Información de usuario actualizada correctamente",
      user: updateUserInfo,
    });
});

// ENVIAR EMAIL PARA CAMBIO DE CONTRASEÑA
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const  { email }  = req.body;

    if (!email) {
      return res.status(400).json({ message: "No se envió un email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Si el email existe, recibirás un correo para restablecer la contraseña" });
    }

    // Crear token temporal (15 minutos)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_RESET_SECRET!,
      { expiresIn: "60m" }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: "Recuperar contraseña - Agora",
      html: `
        <p>Para recuperar tu contraseña de Agora, hacé clic en el siguiente enlace:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>Este enlace expira en 20 minutos.</p>
      `
    });

    res.json({ message: "Si el email existe, recibirás un correo para restablecer la contraseña" });

  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Error al enviar correo" });
  }
};

// CAMBIAR CONTRASEÑAS
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token y contraseña son requeridos" });
    }

    // Verificar token
    const decoded: any = jwt.verify(token, process.env.JWT_RESET_SECRET!);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Guardar contraseña hasheada
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });

  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: "Token inválido o expirado" });
  }
};

// OBTENER INFORMACIÓN DE UN USUARIO POR ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if(!userId){
      return res.status(400).json({ message: "Debe enviar un ID de usuario"});
    };

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "El formato del ID de usuario es inválido" });
    };

    const user = await User.findById(userId).select('-password -__v').lean();    
    if(!user){
      return res.status(404).json({ message: "Usuario no encontrado"});
    };
    res.json(user);
 
  } catch (error) {
    res.status(500).json({ error: error ?? "Error al obtener información de usuario por ID"})
  }
}