import { AppError } from "../utils/AppError";
import { OrderDAL } from "../orders/order.DAL";
import { ProductDAL } from "../products/product.DAL";
import { sendNotification } from "../utils/sendNotification";

const orderDal = new OrderDAL();
const productDal = new ProductDAL();

export async function expireOrder(orderId: string) {
  
  // Buscar la orden por ID
  const order = await orderDal.findById(orderId);

  if (!order) throw new AppError(`La orden ${orderId} no fue encontrada o ya fue procesada`, 404);

  // Actualizar el estado de la orden a expirada
  await orderDal.update(orderId, { status: "expired" });

  // Reponer el stock de los productos
  for (const item of order.items) {
    console.log('ASDKLJASDJKLJKLADSJKLDAS', item.productId.toString(), item.quantity);
    await productDal.incrementStock(item.productId.toString(), item.quantity);
  };

  // Crear notificación en BD y enviar vía socket
  await sendNotification({
    user: order.userId,
    title: 'Orden expirada',
    message: `Tu orden con ID ${orderId} ha expirado por falta de pago.`,
    link: `/orders/detail/${orderId}`
  });
}
