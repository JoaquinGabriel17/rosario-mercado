import { Order } from "../orders/order.model";
import { expireOrder } from "./orderExpiration.service";

const CHECK_INTERVAL_MS = 60_000; // 1 minuto

export function startExpireOrdersJob() {
  setInterval(async () => {
    try {
      const expiredOrders = await Order.find({
        status: "pending_payment",
        expiresAt: { $lt: new Date() },
      }).select("_id");

      for (const order of expiredOrders) {
        await expireOrder(order._id.toString());
      }
    } catch (error) {
      console.error("Error expiring orders:", error);
    }
  }, CHECK_INTERVAL_MS);
}
