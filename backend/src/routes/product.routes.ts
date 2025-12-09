import { Router } from "express";
import { auth } from "../middlewares/auth";
import {
  createProduct,
  getProductsByUserId,
  editProductById,
  deleteProductById
} from "../controllers/product";
import { upload }  from "../middlewares/multer";

const router = Router();

router.post("/", auth, upload.single("image"), createProduct);  // Crear producto
router.get("/:userId", auth, getProductsByUserId);  // Obtener productos por ID de usuario
router.put("/:productId", auth, editProductById);  // Editar producto por ID
router.delete("/:productId", auth, deleteProductById);  // Eliminar producto por ID 

export default router;
