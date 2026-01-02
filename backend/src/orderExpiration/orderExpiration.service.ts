import { Order } from "../orders/order.model";
import Product from "../products/Product.model";
import { AppError } from "../utils/AppError";

export async function expireOrder(orderId: string) {
  const order = await Order.findOne({
    _id: orderId,
    status: "pending_payment",
  });

  if (!order) throw new AppError(`Order id ${orderId} not found or already processed`, 404);

  order.status = "expired";
  await order.save();

  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { stock: item.quantity } }
    );
  }
}
