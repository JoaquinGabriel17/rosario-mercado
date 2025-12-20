import { Request, Response } from "express";
import { Types } from "mongoose";
import { Order } from "./order.model";
import Product from "../models/Product";
import { AuthRequest } from "../middlewares/auth";

interface CreateOrderItem {
  productId: string;
  quantity: number;
}

// CREAR PEDIDO
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { items }: { items: CreateOrderItem[] } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items requeridos" });
    }

    // Buscar productos reales
    const productIds = items.map(i => new Types.ObjectId(i.productId));
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(400).json({ message: "Producto inválido" });
    }

    // Armar items finales
    const orderItems = items.map(item => {
      const product = products.find(
        p => p._id.toString() === item.productId
      );

      if (!product) {
        throw new Error("Producto no encontrado");
      }

      return {
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
      };
    });

    // Calcular total
    const totalAmount = orderItems.reduce(
      (acc, i) => acc + i.price * i.quantity,
      0
    );

    // Crear orden
    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      status: "pending",
      paymentProvider: "mercadopago",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({ message: "Error creando la orden" });
  }
};

// OBTENER PEDIDO POR ID

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id as string;

    
    const order = await Order.findOne({
      _id: id,
      userId,
    });

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json(order);
  } catch (error) {
    console.error("getOrderById error:", error);
    res.status(500).json({ message: "Error obteniendo la orden" });
  }
};


//