import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import Product from "../models/Product";

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const newProduct = await Product.create({
      ...req.body,
      userId: req.user.id,
    });

    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error al crear producto" });
  }
};

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find({ userId: req.user?.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
};
