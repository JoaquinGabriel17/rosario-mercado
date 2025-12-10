import { Router } from "express";
import { auth } from "../middlewares/auth";
import {
  createProduct,
  getProductsByUserId,
  editProductById,
  deleteProductById,
  getProductById
} from "../controllers/product";
import { upload }  from "../middlewares/multer";

const router = Router();

router.post("/", auth, upload.single("image"), createProduct);  // Crear producto
router.get("/user/:userId", getProductsByUserId);  // Obtener productos por ID de usuario
router.put("/:productId", auth,  upload.single("image"), editProductById);  // Editar producto por ID
router.delete("/:productId", auth, deleteProductById);  // Eliminar producto por ID 
router.get("/:productId", getProductById) //Obtener producto por ID de producto

export default router;
