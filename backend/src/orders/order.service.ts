import { OrderDAL } from "./order.DAL";
import { AppError } from "../utils/AppError";
import { ProductDAL } from "../products/product.DAL";
import Schema from "mongoose";
import { sendNotification } from "../utils/sendNotification";

const orderDal = new OrderDAL();
const productDal = new ProductDAL();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

export const createOrder = async (items: any[], userId: Schema.Types.ObjectId) => {
  const expiresAt = new Date();
  // Tiempo de expiración de la orden: 20 minutos
  expiresAt.setMinutes(expiresAt.getMinutes() + 20);
  let sellerId = "";
  try{

  // 1. Mapeamos y procesamos el stock de cada item
  // Usamos Promise.all para que las consultas se ejecuten en paralelo (más rápido)
  await Promise.all(
    items.map(async (item) => {
      const productToBuy = await productDal.findById(item.productId);

      if(!productToBuy) throw new AppError('Uno o mas productos no existentes', 404);
      if(productToBuy.stock < item.quantity) throw new AppError(`Stock insuficiente para el producto: ${productToBuy.title}`, 400)

      const updatedProduct = await productDal.decrementStock(
        item.productId,
        item.quantity
      );

      // 2. Si el DAL devuelve null, es porque no había stock suficiente
      if (!updatedProduct) throw new AppError(`Stock insuficiente para el producto con ID: ${item.productId}`,400);
    })
  );

  // 3. Una vez restado el stock de todos, creamos la orden
  const newOrder = await orderDal.create({
    items,
    expiresAt,
    status: "pending_payment",
    userId
  });
  
  // Enviamos notificaciones al usuario comprador y al vendedor.

  sendNotification({  //comprador
    user: userId.toString(),
    title: 'Tu pedido fue creado',
    message: `Tu pedido con ID ${newOrder._id} ha sido creada exitosamente. Puedes ver la información del vendedor haciendo click aquí.`,
    link: `/users/${sellerId}`,
    createDate: Date.now()
  });
  sendNotification({  //vendedor
    user: sellerId,
    title: '¡Tienes un pedido pendiente!',
    message: `Se ha creado el pedido con ID ${newOrder._id}. Puedes ver la información del comprador haciendo click aquí.`,
    link: `/users/${userId}`,
    createDate: Date.now()
  });
  return newOrder;
 } catch (error) {
  console.log(error);
  throw new AppError('Error al crear la orden', 500);
 }
 
};

// OBTENER ORDEN POR ID 
export const getOrder = async (id: string) => {
  // Buscar orden
  const order = await orderDal.getByIdWithProductsInfo(id);
  if (!order) throw new AppError("La orden solicitada no existe", 404);
  return order;
};

// ACTUALIZAR ESTADO DE LA ORDEN
export const updateStatus = async (id: string, status: "paid" | "expired") => {
  // Actualizar el estado de la orden
  const updatedOrder = await orderDal.update(id, { status });
  // Enviar notificación al usuario sobre el cambio de estado
  sendNotification({
    user: updatedOrder?.userId,
    title: `Estado de orden actualizado a ${status}`,
    message: `Tu orden ha sido actualizada a estado ${status}.`,
    link: `/orders/detail/${id}`
  });

  if (!updatedOrder) throw new AppError("No se pudo actualizar la orden", 404);
  return updatedOrder;
};

// OBTENER PEDIDOS POR ID DE USUARIO
export const getOrdersByUserId = async (userId: string) => {
  if(!userId) throw new AppError("ID de usuario requerido", 400);

  const orders = await orderDal.findByUserId(userId.toString());

  if(!orders) throw new AppError(`No se encontraron órdenes para este usuario ${userId}`, 404);
  return orders;
};