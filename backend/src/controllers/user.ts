import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, password, email, phoneNumber, businessHours, address, whatsappAvailable, delivery } = req.body;

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
    });

    return res.json({
      message: "Usuario creado correctamente",
      user: { id: newUser._id, email:newUser.email, name: newUser.name }
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};

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
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error al hacer login", error });
  }
};
