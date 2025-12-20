import { Request, Response } from "express";
import { Order } from "../orders/order.model";

export const paymentWebhook = async (req: Request, res: Response) => {
  try {
    const { paymentId, status } = req.body;

    if (!paymentId || !status) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const order = await Order.findOne({ paymentId });

    if (!order) {
      return res.sendStatus(404);
    }

    if (status === "approved") {
      order.status = "paid";
    } else if (status === "rejected") {
      order.status = "failed";
    }

    await order.save();

    res.sendStatus(200);
  } catch (error) {
    console.error("paymentWebhook error:", error);
    res.sendStatus(500);
  }
};
