import { OrderDAL } from "./order.DAL";
import { AppError } from "../utils/AppError";
import { ProductDAL } from "../products/product.DAL";
import { mpPreference, client } from "../config/mercadopago";
import { Payment } from "mercadopago";
import Schema from "mongoose";

const orderDal = new OrderDAL();
const productDal = new ProductDAL();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

export const createOrder = async (items: any[], userId: Schema.Types.ObjectId) => {
  const expiresAt = new Date();
  // Tiempo de expiración de la orden: 10 minutos
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  const itemsForMercadoPago: any[] = [];

  // 1. Mapeamos y procesamos el stock de cada item
  // Usamos Promise.all para que las consultas se ejecuten en paralelo (más rápido)
  await Promise.all(
    items.map(async (item) => {
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
  // 4. Crear la Preferencia en Mercado Pago
  /*
  const response = await mpPreference.create({
    body: {
      items: itemsForMercadoPago,
      back_urls: {
        success: `${frontendUrl}/orders/payment/success`,
        failure: `${frontendUrl}/orders/payment/failure`,
        pending: `${frontendUrl}/orders/payment/pending`,
      },
      auto_return: "approved",
      external_reference: newOrder._id.toString(), // Guardamos el ID de la orden para identificarla luego
      notification_url: "https://pvgj8rdd-4000.brs.devtunnels.ms/orders/webhook", // Muy importante para recibir el pago
    }
  });

  // Retornamos la orden y el init_point (el link al que el usuario debe ir)
  return {
    order: newOrder,
    init_point: response.init_point, // Link de Checkout Pro
    preferenceId: response.id
  };

  */
 // 4. Crear la Preferencia en Mercado Pago
 if(!frontendUrl) throw new AppError("url mal definida", 500);
/*try {*/

  const response = await mpPreference.create({
    body: {
      items: itemsForMercadoPago,
      back_urls: {
        success: `https://agora-six-rho.vercel.app/`,
        failure: `https://agora-six-rho.vercel.app/`,
        pending: `https://agora-six-rho.vercel.app/`,
      },
      auto_return: "approved",
      external_reference: newOrder._id.toString(),
      notification_url: "https://pvgj8rdd-4000.brs.devtunnels.ms/orders/webhook",
    }
  });

  return {
    order: newOrder,
    init_point: response.init_point,
    preferenceId: response.id
  };
/** } catch (error: any) {
  // ESTO TE DIRÁ EXACTAMENTE QUÉ CAMPO FALLA
  console.error("Error detallado de Mercado Pago:", error.api_response?.data || error);
  throw new AppError("Error al crear la preferencia de pago", 400);
}*/
};

export const getOrder = async (id: string) => {
  const order = await orderDal.findById(id);
  if (!order) throw new AppError("La orden solicitada no existe", 404);
  return order;
};

export const updateStatus = async (id: string, status: "paid" | "expired") => {
  const updatedOrder = await orderDal.update(id, { status });
  if (!updatedOrder) throw new AppError("No se pudo actualizar la orden", 404);
  return updatedOrder;
};

export const handleWebhook = async (paymentId: string) => {
  const payment = new Payment(client);

  // 1. Buscamos el pago en los servidores de Mercado Pago para estar seguros
  const paymentInfo = await payment.get({ id: paymentId });

  // 2. Extraemos el ID de la orden que guardamos en 'external_reference'
  const orderId = paymentInfo.external_reference;
  const status = paymentInfo.status;

  if (!orderId) throw new AppError("No se encontró la referencia de la orden", 400);

  // 3. Si el pago fue aprobado, actualizamos nuestra base de datos
  if (status === "approved") {
    await orderDal.update(orderId, { status: "paid" });
    await orderDal.increaseSoldCount(orderId);
    // Aquí podrías disparar otras acciones: enviar mail, imprimir ticket, etc.
  } 
  
  // 4. (Opcional) Si el pago fue rechazado o cancelado, se devuelve el stock
  else if (status === "rejected" || status === "cancelled") {
    const order = await orderDal.findById(orderId);
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