import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import * as OrderService from "./order.service";
import { sendNotification } from "../utils/sendNotification";
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
    orderId: newOrder._id
  });
});

// OBTENER ORDEN POR ID
export const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) throw new AppError("ID de orden requerido", 400);

  const order = await OrderService.getOrder(id);

  return res.status(200).json(order);
});

// ACTUALIZAR ESTADO DE PEDIDO
export const updateStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id, status } = req.body;

  if(!id) throw new AppError("Id de orden requerido", 400);
  if(!status) throw new AppError("El estado es obligatorio para actualizar el pedido", 400)

  // Actualizar el estado de la orden
  const updatedOrder = await OrderService.updateStatus(id, status);

  

  return res.status(200).json({
    message: "Orden actualizada con éxito",
    order: updatedOrder,
  });
});

// OBTENER TODAS LAS COMPRAS POR ID DE USUARIO 
export const getOrdersByBuyerId = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  const orders = await OrderService.getOrdersByBuyerId(userId);
  
  return res.status(200).json(orders);
});

// OBTENER TODAS LAS VENTAS POR ID DE USUARIO
export const getOrdersBySellerId = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  const orders = await OrderService.getOrdersBySellerId(userId);

  return res.status(200).json(orders);
});