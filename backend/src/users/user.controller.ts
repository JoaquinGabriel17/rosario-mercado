import { Request, Response } from "express";
import User from "./User.model";
import { AuthRequest } from "../middlewares/auth";
import mongoose from "mongoose";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import * as UserService from "./user.service";


// CREAR USUARIO
export const register = catchAsync( async (req: Request, res: Response) => {
    const { name, password, email } = req.body;

    if(!name || !password || !email) throw new AppError("Faltan datos obligatorios", 400);

    const newUser = await UserService.registerUser(req.body);

    return res.status(201).json({
      message: "Usuario creado correctamente",
      user: newUser
    });
});

// INICIAR SESION
export const login = catchAsync( async (req: Request, res: Response) => {

  const { email, password } = req.body;

  if(!email || !password) throw new AppError("Faltan datos obligatorios", 400);

  const loguedUser = await UserService.loginUser(email, password);
  
  return res.status(200).json(loguedUser); 
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
    if (Object.keys(updates).length === 0) throw new AppError("No se enviaron campos válidos para actualizar", 400);

    const updatedUser = await UserService.updateUserInfo(userId, updates);

    res.status(200).json({
      message: "Información de usuario actualizada correctamente",
      user: updatedUser
    });
});

// ENVIAR EMAIL PARA CAMBIO DE CONTRASEÑA
export const forgotPassword = catchAsync( async (req: Request, res: Response) => {
  
    const  { email }  = req.body;

    if (!email) throw new AppError("El email es requerido", 400);

    await UserService.sendResetPasswordEmail(email);

    res.json({ message: "Si el email existe, recibirás un correo para restablecer la contraseña" });
});

// CAMBIAR CONTRASEÑAS
export const resetPassword = catchAsync( async (req: Request, res: Response) => {
  
    const { token, password } = req.body;

    if (!token || !password) throw new AppError("Token y nueva contraseña son requeridos", 400);

    await UserService.resetUserPassword(token, password);

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
});

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