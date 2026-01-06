import { OrderDAL } from "./order.DAL";
import { AppError } from "../utils/AppError";
import { ProductDAL } from "../products/product.DAL";
import Schema from "mongoose";
import { sendNotification } from "../utils/sendNotification";

const orderDal = new OrderDAL();
const productDal = new ProductDAL();

export const createOrder = async (items: any[], userId: Schema.Types.ObjectId) => {
  const expiresAt = new Date();
  // Tiempo de expiración de la orden: 20 minutos
  expiresAt.setMinutes(expiresAt.getMinutes() + 20);
  let sellerId = ""

  // 1. Mapeamos y procesamos el stock de cada item
  // Usamos Promise.all para que las consultas se ejecuten en paralelo (más rápido)
  await Promise.all(
    items.map(async (item) => {
      const productToBuy = await productDal.findById(item.productId);
      

      if(!productToBuy) throw new AppError('Uno o mas productos no existentes', 404);
      sellerId = productToBuy.userId;
      if(productToBuy.stock < item.quantity) throw new AppError(`Stock insuficiente para el producto: ${productToBuy.title}`, 400)

      const updatedProduct = await productDal.decrementStock(
        item.productId,
        item.quantity
      );
      // 2. Si el DAL devuelve null, es porque no había stock suficiente
      if (!updatedProduct) throw new AppError(`Stock insuficiente para el producto con ID: ${item.productId}`,400);
    })
  );

  // 3. Una vez restado el stock de todos los productos, creamos la orden
  const newOrder = await orderDal.create({
    items,
    expiresAt,
    status: "pending",
    buyerId: userId,
    sellerId: sellerId
  });
  
  // Enviamos notificaciones al usuario comprador y al vendedor.

  sendNotification({  //comprador
    user: userId,
    title: 'Tu pedido fue creado',
    message: `Tu pedido con ID ${newOrder._id} ha sido creada exitosamente. Puedes ver la información del vendedor haciendo click aquí.`,
    link: `/users/${sellerId}`
  });
  sendNotification({  //vendedor
    user: sellerId,
    title: '¡Tienes un pedido pendiente!',
    message: `Se ha creado el pedido con ID ${newOrder._id}. Puedes ver la información del comprador haciendo click aquí.`,
    link: `/users/${userId}`
  });

  return newOrder ;
};

// OBTENER ORDEN POR ID
export const getOrder = async (id: string) => {
  // Buscar orden
  const order = await orderDal.getByIdWithProductsInfo(id);
  if (!order) throw new AppError("La orden solicitada no existe", 404);
  return order;
};

// ACTUALIZAR ESTADO DE LA ORDEN
export const updateStatus = async (id: string, status: string) => {
  // Actualizar el estado de la orden
  const updatedOrder = await orderDal.update(id, { status });
  // Enviar notificación al usuario sobre el cambio de estado
  sendNotification({
    user: updatedOrder?.sellerId,
    title: `Estado de orden actualizado a ${status}`,
    message: `Tu orden ha sido actualizada a estado ${status}.`,
    link: `/orders/detail/${id}`
  });

  if (!updatedOrder) throw new AppError("No se pudo actualizar la orden", 404);
  return updatedOrder;
};

// OBTENER PEDIDOS POR ID DE USUARIO COMPRADOR
export const getOrdersByBuyerId = async (userId: string) => {
  if(!userId) throw new AppError("ID de usuario requerido", 400);

  const orders = await orderDal.findByBuyerId(userId.toString());

  if(!orders) throw new AppError(`No se encontraron órdenes para este usuario ${userId}`, 404);
  return orders;
};

// OBTENER TODOS LOS PEDIDOS POR ID DE VENDEDOR
export const getOrdersBySellerId = async (userId: string) => {
  if(!userId) throw new AppError("ID de usuario requerido", 400);

  const orders = await orderDal.findBySellerId(userId.toString());

  if(!orders) throw new AppError(`No se encontraron ventas para este usuario ${userId}`, 404);
  return orders;
};