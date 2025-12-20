import { Router } from "express";
import { paymentWebhook } from "./payment.controller";

const router = Router();

router.post("/webhook", paymentWebhook);

export default router;
