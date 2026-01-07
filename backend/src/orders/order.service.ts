import { OrderDAL } from "./order.DAL";
import { AppError } from "../utils/AppError";
import { ProductDAL } from "../products/product.DAL";
import { mpPreference, client } from "../config/mercadopago";
import { Payment } from "mercadopago";
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

      // Guardamos la info para MP (título y precio vienen del producto actualizado)
      itemsForMercadoPago.push({
        id: updatedProduct._id.toString(),
        title: updatedProduct.title, 
        quantity: Number(item.quantity),
        unit_price: Number(updatedProduct.price), 
        currency_id: "ARS"
      });

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
  return {
    order: newOrder,
    init_point: response.init_point,
    preferenceId: response.id
  };
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

// MANEJAR WEBHOOK DE MERCADO PAGO
export const handleWebhook = async (paymentId: string) => {
  const payment = new Payment(client);

  // 1. Buscamos el pago en los servidores de Mercado Pago para estar seguros
  const paymentInfo = await payment.get({ id: paymentId });

  // 2. Extraemos el ID de la orden que guardamos en 'external_reference'
  const orderId = paymentInfo.external_reference;
  const status = paymentInfo.status;

  const order = await orderDal.findById(orderId!);
  if(!order) throw new AppError(`La orden ${orderId} no fue encontrada`, 404);

  if (!orderId) throw new AppError("No se encontró la referencia de la orden", 400);

  // 3. Si el pago fue aprobado, actualizamos nuestra base de datos
  if (status === "approved") {
    await orderDal.update(orderId, { status: "paid" }); // Actualizamos el estado de la orden
    await orderDal.increaseSoldCount(orderId); // Aumentamos el contador de ventas de los productos
    await sendNotification({ // Creamos y enviamos una notificación de pago exitoso
      user: order.userId,
      title: 'Pago exitoso',
      message: `Tu orden con ID ${orderId} ha sido pagada exitosamente. Ponte en contacto con el vendedor para consultar sobre el envío.`,
      link: `/orders/detail/${orderId}`
    });
  } 
  
  // 4. Si el pago fue rechazado o cancelado, se devuelve el stock y se actualiza el estado del pedido
  else if (status === "rejected" || status === "cancelled") {
    
    await sendNotification({ // Creamos y enviamos una notificación de pago cancelado o rechazado
      user: order.userId,
      title: 'Pago cancelado o rechazado',
      message: `El pago de tu orden con ID ${orderId} ha sido cancelado o rechazado. Por favor, intenta realizar el pago nuevamente si deseas completar tu compra.`,
      link: `/orders/detail/${orderId}`
    });

    if (order) {
      await Promise.all(
        order.items.map(async (item) => {
          await productDal.incrementStock(item.productId.toString(), item.quantity);
        })
      );
      await orderDal.update(orderId, { status });
    }
  }

  return { orderId, status };
};

// OBTENER PEDIDOS POR ID DE USUARIO
export const getOrdersByUserId = async (userId: string) => {
  if(!userId) throw new AppError("ID de usuario requerido", 400);

  const orders = await orderDal.findByUserId(userId.toString());

  if(!orders) throw new AppError(`No se encontraron órdenes para este usuario ${userId}`, 404);
  return orders;
};