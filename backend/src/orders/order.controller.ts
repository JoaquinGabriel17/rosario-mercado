import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import * as OrderService from "./order.service";
import { AuthRequest } from "../middlewares/auth";

// CREAR ORDEN
export const createOrder = catchAsync(async (req: AuthRequest, res: Response) => {
  const { items } = req.body;
  const userId = req.user?.id;

  if(!userId) throw new AppError("Usuario no autenticado", 401);

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError("Debes incluir al menos un producto en la orden", 400);
  }

  const newOrder = await OrderService.createOrder(items, userId);

  return res.status(201).json({
    message: "Orden generada. Redirigiendo a pago...",
    orderId: newOrder.order._id,
    init_point: newOrder.init_point // El frontend usará este link
  });
});

// OBTENER ORDEN POR ID
export const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) throw new AppError("ID de orden requerido", 400);

  const order = await OrderService.getOrder(id);

  return res.status(200).json(order);
});

// MARCAR COMO PAGADA
export const markAsPaid = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if(!id) throw new AppError("Id de orden requerido", 400);

  const updatedOrder = await OrderService.updateStatus(id, "paid");

  return res.status(200).json({
    message: "Orden pagada con éxito",
    order: updatedOrder,
  });
});

// WEBHOOK DE MERCADO PAGO
export const receiveWebhook = catchAsync(async (req: Request, res: Response) => {
  const { query } = req;

  // Mercado Pago envía notificaciones de varios tipos. Nos interesa 'payment'.
  const topic = query.topic || query.type;

  if (topic === "payment") {
    const paymentId = query.id || query["data.id"];
    
    if (paymentId) {
      await OrderService.handleWebhook(paymentId as string);
    }
  }

  // Siempre respondemos 200 o 201 a Mercado Pago para que deje de reintentar
  return res.status(200).send("OK");
});

// OBTENER TODAS LAS ORDENES POR ID DE USUARIO
export const getOrdersByUserId = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) throw new AppError("ID de usuario requerido", 400);

  const orders = await OrderService.getOrdersByUserId(userId);

  return res.status(200).json(orders);
});