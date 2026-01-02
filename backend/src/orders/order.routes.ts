import { Router } from "express";
import * as OrderController from "./order.controller";
// import { protect } from "../middlewares/auth"; // Si quisieras protegerlas

const router = Router();

router.post("/", OrderController.createOrder);
router.get("/:id", OrderController.getOrderById);
router.patch("/:id/pay", OrderController.markAsPaid);
router.post("/webhook", OrderController.receiveWebhook);

export default router;