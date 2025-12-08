import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import Product from "../models/Product";
import User from "../models/User";
import mongoose from "mongoose";

// CREAR PRODUCTO
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, price, category, images } = req.body;
    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }


  
    const newProduct = await Product.create({
      ...req.body,
      userId: req.user.id,
    });

    res.json(newProduct);

  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// OBTENER PRODUCTOS POR ID DE USUARIO
export const getProductsByUserId = async (req: AuthRequest, res: Response) => {
  try {
    const {userId} = req.params;

    if (!userId) return res.status(400).json({ message: "Falta el ID de usuario" });

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "El formato de userId es inválido"
      });
    }
    
    const findUser = await User.findById(userId);
    if (!findUser) return res.status(404).json({ message: "No se encontró un usuario con el ID proporcionado" });

    const products = await Product.find({ userId: userId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error || "Error al obtener productos" });
  }
};

// EDITAR PRODUCTO POR ID
export const editProductById = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    if(!productId){
      return res.status(400).json({ message: "No se envió el ID del producto" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "El formato de productId es inválido" });
    }

    if(!req.body){
      return res.status(400).json({ message: "No se enviaron datos para editar" });
    }
    const { title, images, description, price, category}= req.body;
    if (
  title === undefined &&
  description === undefined &&
  price === undefined &&
  category === undefined &&
  images === undefined
) {
  return res.status(400).json({ message: "No se enviaron datos para editar" });
}

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { title, images, description, price, category },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({message: "producto editado correctamente", updatedProduct});

  } catch (error) {
    if(error )
    res.status(500).json({ message:  error });
  }
};

// ELIMINAR PRODUCTO POR ID
export const deleteProductById = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    if(!productId){
      return res.status(400).json({ message: "No se envió el ID del producto" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "El formato de productId es inválido" });
    }

    const productToDelete = await Product.findById(productId);
    if (!productToDelete) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (productToDelete.userId !== req.user.id) {
      return res.status(403).json({ message: "El ID del producto enviado no pertenece a tu usuario" });
    }
    await Product.findByIdAndDelete(productId);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    
  }
};