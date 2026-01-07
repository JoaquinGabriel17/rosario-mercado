import { Order } from "../orders/order.model";
import { expireOrder } from "./orderExpiration.service";

const CHECK_INTERVAL_MS = 60_000; // 1 minuto

export function startExpireOrdersJob() {
  setInterval(async () => {
    try {
      // Encontrar todas las órdenes que han expirado y están pendientes de pago
      const expiredOrders = await Order.find({
        status: "pending",
        expiresAt: { $lt: new Date() },
      }).select("_id");

      // Expirar cada orden encontrada
      for (const order of expiredOrders) {
        await expireOrder(order._id.toString());
      }
    } catch (error) {
      console.error("Error expiring orders:", error);
    }
  }, CHECK_INTERVAL_MS);
}
