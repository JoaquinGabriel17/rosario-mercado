import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import * as OrderService from "./order.service";
import { AuthRequest } from "../middlewares/auth";
import { sendNotification } from "../utils/sendNotification";

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
    message: "Orden generada.",
    orderId: newOrder._id,
    orderData: newOrder, 
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
export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const { id, status } = req.body;

  if(!id) throw new AppError("Id de orden requerido", 400);

  const updatedOrder = await OrderService.updateStatus(id, status);

  return res.status(200).json({
    message: "Estado de pedido modificado con éxito",
    order: updatedOrder,
  });
});


// OBTENER TODAS LAS ORDENES POR ID DE USUARIO COMPRADOR
export const getOrdersByBuyerId = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) throw new AppError("ID de usuario requerido", 400);

  const orders = await OrderService.getOrdersByBuyerId(userId);

  return res.status(200).json(orders);
});

//OBTENER TODAS LOS PEDIDOS POR ID DE USUARIO VENDEDOR
export const getOrdersBySellerId = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) throw new AppError("ID de usuario requerido", 400);

  const orders = await OrderService.getOrdersBySellerId(userId);

  return res.status(200).json(orders);
});
