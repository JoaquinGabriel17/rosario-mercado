import { Router } from "express";
import * as OrderController from "./order.controller";
import { auth } from "../middlewares/auth";
// import { protect } from "../middlewares/auth"; // Si quisieras protegerlas

const router = Router();

router.post("/", auth, OrderController.createOrder);
router.get("/:id", OrderController.getOrderById);
router.patch("/:id/pay", OrderController.markAsPaid);
router.post("/webhook", OrderController.receiveWebhook);
router.get("/user/orders", auth, OrderController.getOrdersByUserId);

export default router;


