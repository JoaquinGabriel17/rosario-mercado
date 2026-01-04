import { Router } from "express";
import { findByUserId, markAllAsRead } from "./notification.controller";
import { auth } from "../middlewares/auth";

const router = Router();

router.get("/user", auth, findByUserId);
router.post("/mark-all-as-read", auth, markAllAsRead);


export default router;