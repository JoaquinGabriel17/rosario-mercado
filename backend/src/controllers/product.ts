import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import Product from "../models/Product";
import User from "../models/User";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary";

// CREAR PRODUCTO
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    let imageUrl = "";

    // Si viene archivo → subir a Cloudinary con await
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result!.secure_url);
          }
        );

        uploadStream.end(req.file!.buffer);
      });
    }


    const newProduct = await Product.create({
      title,
      description,
      price,
      category,
      image: imageUrl,
      userId: req.user.id,
    });

    return res.json(newProduct);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear producto" });
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