import { AppError } from "../utils/AppError";
import { OrderDAL } from "../orders/order.DAL";
import { ProductDAL } from "../products/product.DAL";
import { sendNotification } from "../utils/sendNotification";
import { NotificationDAL } from "../notifications/notification.DAL";
import { updateStatus } from "../orders/order.service";

const orderDal = new OrderDAL();
const productDal = new ProductDAL();
const notificationDal = new NotificationDAL();

export async function expireOrder(orderId: string) {
  
  // Buscar la orden por ID
  const order = await orderDal.findById(orderId);

  if (!order) throw new AppError(`La orden ${orderId} no fue encontrada o ya fue procesada`, 404);

  // Actualizar el estado de la orden a expirada
  await updateStatus(orderId, "expired" );

  // Reponer el stock de los productos
  for (const item of order.items) {
    await productDal.incrementStock(item.productId.toString(), item.quantity);
  };

  // Eliminar las notificaciones con mas de 2 días de antigüedad
  notificationDal.deleteTwoDaysLater();
}
