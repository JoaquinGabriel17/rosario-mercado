import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body;

    const userExists = await User.findOne({ name });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, password: hashed });

    return res.json({
      message: "Usuario creado correctamente",
      user: { id: newUser._id, name: newUser.name }
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body;
    
    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Password incorrecto" });
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login correcto",
      token,
      user: { id: user._id, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ message: "Error al hacer login", error });
  }
};
