import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import * as OrderService from "./order.service";

// CREAR ORDEN
export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError("Debes incluir al menos un producto en la orden", 400);
  }

  const newOrder = await OrderService.createOrder(items);

  return res.status(201).json({
    message: "Orden creada correctamente",
    order: newOrder,
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