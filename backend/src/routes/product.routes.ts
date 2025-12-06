import { Router } from "express";
import { auth } from "../middlewares/auth";
import {
  createProduct,
  getProducts
} from "../controllers/product";

const router = Router();

router.post("/", auth, createProduct);  // Crear producto
router.get("/", getProducts);        // Todos los productos

export default router;
