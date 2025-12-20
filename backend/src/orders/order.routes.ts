import { Router } from "express";
import {
  createOrder,
  getOrderById,
} from "./order.controller";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/", auth, createOrder);
router.get("/:id", auth, getOrderById);

export default router;
