import { Router } from "express";
import { findByUserId } from "./notification.controller";
import { auth } from "../middlewares/auth";

const router = Router();

router.get("/user", auth, findByUserId);


export default router;