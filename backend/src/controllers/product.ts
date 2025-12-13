import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import Product from "../models/Product";
import User from "../models/User";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary";
import { uploadToCloudinary } from "../utils/cloudinary";




// CREAR PRODUCTO
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    //haz un tipo para imageData


    const { title, description, price, category, stock, soldCount } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    
    // Si viene archivo → subir a Cloudinary con await
    if (!req.file) {
      return res.status(400).json({ message: "No se envió una imagen para crear el producto" });
    }

      const imageData = await new Promise<{ imageUrl: string; imageId: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) return reject(error);
            resolve({imageUrl: result!.secure_url, imageId: result!.public_id});
          }
        );

        uploadStream.end(req.file!.buffer);
      });
    


    const newProduct = await Product.create({
      title,
      description,
      price,
      category,
      imageUrl: imageData.imageUrl,
      imageId:  imageData.imageId, 
      userId: req.user.id,
      stock: stock ?? 0,
      soldCount: soldCount ?? 0
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
    const uploadToCloudinary = (fileBuffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "productos" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};


    const { productId } = req.params;
    if(!productId){
      return res.status(400).json({ message: "No se envió el ID del producto" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "El formato de productId es inválido" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    // verificar que el producto pertenezca al usuario autenticado
    if (product.userId !== req.user.id) {
      return res.status(403).json({ message: "El ID del producto enviado no pertenece a tu usuario" });
    }


 // 1. Si viene una nueva imagen
    if (req.file) {
  console.log("Nueva imagen recibida");

  // Subir buffer en vez de req.file.path
  const uploadResult = await uploadToCloudinary(req.file.buffer);

  // Eliminar imagen vieja si existe
  if (product.imageUrl) {
    await cloudinary.uploader.destroy(product.imageId);
  }

  product.imageUrl = uploadResult.secure_url;
  product.imageId = uploadResult.public_id;
}

    

        // 2. Actualizar campos comunes si fueron enviados
    const { title, description, price, category}= req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;

    const updatedProduct =  await product.save();

    
    res.json({message: "producto actualizado correctamente", updatedProduct});

  } catch (error) {
    res.status(500).json({ message: error || "Error al obtener productos" });

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
    res.status(500).json({ message: error || "Error al eliminar producto" });
  }
};

//OBTENER PRODUCTO POR ID DE PRODUCTO
export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params
    if(!productId){
      return res.status(400).json({ message: "No se envió el ID del producto" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "El formato de productId es inválido" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product)

  } catch (error) {
    res.status(500).json({ message: error || "Error al obtener productos" });
  }
};

// OBTENER PRODUCTOS ORDENADOS DESC. POR VENTAS
export const getProductsToHome = async (req: Request, res: Response) => {
  try {
    const [bestSellers, combos, bebidasTop] = await Promise.all([
    Product.find().sort({ soldCount: -1 }).limit(10),
    Product.find({ category: "combos" }).sort({ soldCount: -1 }).limit(10),
    Product.find({ category: "bebidas" }).sort({ soldCount: -1 }).limit(10),
  ]);

  res.json({ bestSellers, combos, bebidasTop });
  } catch (error) {
    res.status(500).json({ message: error || "Error al obtener productos" });
  }
}