import { Order } from "../orders/order.model";
import Product from "../products/Product.model";
import { AppError } from "../utils/AppError";
import { Notification } from "../notifications/notification.model";
import { getIO } from "../config/socket";

export async function expireOrder(orderId: string) {
  const order = await Order.findOne({
    _id: orderId,
    status: "pending_payment",
  });

  if (!order) throw new AppError(`Order id ${orderId} not found or already processed`, 404);

  order.status = "expired";
  await order.save();

  // Reponer el stock de los productos
  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { stock: item.quantity } }
    );
  }

  // Crear notificación en BD
  const newNotif = await Notification.create({
    user: order.userId,
    title: 'Actualización de pedido',
    message: `Tu pedido ${orderId} ha expirado`,
    link: `/orders/detail/${orderId}`
  });
  
  // Emitir notificación en tiempo real vía Socket.io
  try {
    const io = getIO();
    io.to(order.userId.toString()).emit('new_notification', newNotif);
    
  } catch (error) {
    // Es buena idea envolverlo en try/catch para que si el socket falla,
    // no rompa la lógica principal de expiración de la orden.
    console.error("Error enviando socket:", error);
  }
}
