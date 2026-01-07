import { Router } from "express";
import * as OrderController from "./order.controller";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/", auth, OrderController.createOrder); // Crear
router.get("/:id", OrderController.getOrderById); // Obtener orden por ID
router.patch("/:id/update-status", OrderController.updateStatus); // Actualizar orden
router.get("/user/orders", auth, OrderController.getOrdersByBuyerId); // Obtener todas las órdenes por ID de comprador
router.get("/user/sales", auth, OrderController.getOrdersBySellerId) // Obtener todas las órdenes por ID de vendedor

export default router;


