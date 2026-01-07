import { Router } from "express";
import * as OrderController from "./order.controller";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/", auth, OrderController.createOrder);
router.get("/:id", OrderController.getOrderById);
router.patch("/:id/update-status", OrderController.updateStatus);
router.get("/user/orders", auth, OrderController.getOrdersByBuyerId);
router.get("/user/sales", auth, OrderController.getOrdersBySellerId)

export default router;


