import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middlewares/auth";
import sendEmail from "../utils/sendEmail"; // función que envía correo
import mongoose from "mongoose";
import { resend } from "../config/resend";


// CREAR USUARIO
export const register = async (req: Request, res: Response) => {
  try {
    const { name, password, email, phoneNumber, businessHours, address, whatsappAvailable, delivery, facebookUrl, instagramUrl } = req.body;

    if(!name || !password || !email) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const userExists = await User.findOne({ name });
    if (userExists) {
      return res.status(400).json({ message: "El nombre de usuario ya existe" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email, name, password: hashed,
      phoneNumber: phoneNumber || undefined,
      businessHours: businessHours || undefined,
      address: address || undefined,
      whatsappAvailable: whatsappAvailable ?? false,
      delivery: delivery ?? false,
      facebookUrl: facebookUrl ?? undefined,
      instagramUrl: instagramUrl ?? undefined
    });

    return res.json({
      message: "Usuario creado correctamente",
      user: { id: newUser._id, email:newUser.email, name: newUser.name }
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};

// INICIAR SESION
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Password incorrecto" });
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login correcto",
      token,
      user: { id: user._id, email: user.email, name: user.name,
        phoneNumber: user.phoneNumber,
        businessHours: user.businessHours,
        address: user.address,
        whatsappAvailable: user.whatsappAvailable,
        delivery: user.delivery,
        facebookUrl: user.facebookUrl,
        instagramUrl: user.instagramUrl,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error al hacer login", error });
  }
};

// ACTUALIZAR INFORMACIÓN DE USUARIO
export const updateInfo = async (req: AuthRequest, res: Response) => {
  try {
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
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No se envió ningún campo válido para actualizar",
      });
    }

    // Validar email duplicado
if (updates.email) {
  const emailExists = await User.findOne({
    email: updates.email,
    _id: { $ne: userId }, // excluir al usuario actual
  });

  if (emailExists) {
    return res.status(400).json({
      message: "El email ingresado ya está registrado"
    });
  }
}

// Validar nombre duplicado
if (updates.name) {
  const nameExists = await User.findOne({
    name: updates.name,
    _id: { $ne: userId }, // excluir al usuario actual
  });

  if (nameExists) {
    return res.status(400).json({
      message: "El nombre ingresado ya está registrado"
    });
  }
}

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      user: updatedUser,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error
    });
  }
}

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