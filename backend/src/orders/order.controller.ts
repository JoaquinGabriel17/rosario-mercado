import { Request, Response } from "express";
import { Types } from "mongoose";
import { Order } from "./order.model";
import Product from "../models/Product";
import { AuthRequest } from "../middlewares/auth";
import { orderExpirationQueue } from "../queues/orderExpiration.queue";
import mongoose from "mongoose";

interface CreateOrderItem {
  productId: string;
  quantity: number;
}

const ORDER_EXPIRATION_MINUTES = 15;

// CREAR PEDIDO
export const createOrder = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();

  try {
    const userId = req.user.id;
    const { items }: { items: CreateOrderItem[] } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items requeridos" });
    };

    session.startTransaction();

    // Buscar productos reales
    const productIds = items.map(i => new Types.ObjectId(i.productId));
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(400).json({ message: "Uno o mas productos son inválidos. Revisa los ID proporcionados de los mismos" });
    };

    // 2️⃣ Validar stock disponible
    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId);

      if (!product) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Producto no encontrado" });
      }

      const availableStock = product.totalStock - product.reservedStock!;

      if (availableStock < item.quantity) {
        await session.abortTransaction();
        return res.status(409).json({
          message: `Stock insuficiente para ${product.title}`,
        });
      }
    }

     // 3️⃣ Reservar stock
    for (const item of items) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { reservedStock: item.quantity } },
        { session }
      );
    }

    // 4️⃣ Armar snapshot
    const orderItems = items.map((item: any) => {
      const product = products.find(p => p._id.toString() === item.productId)!;

      return {
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
      };
    });

    const totalAmount = orderItems.reduce(
      (acc, i) => acc + i.price * i.quantity,
      0
    );

    const expiresAt = new Date(
      Date.now() + ORDER_EXPIRATION_MINUTES * 60 * 1000
    );

    // 5️⃣ Crear orden
    const order = await Order.create(
      [{
        userId,
        items: orderItems,
        totalAmount,
        status: "pending_payment",
        expiresAt,
        paymentProvider: "mercadopago",
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // 6️⃣ Programar expiración
    await orderExpirationQueue.add(
      "expire-order",
      { orderId: order[0]?._id.toString() },
      {
        delay: expiresAt.getTime() - Date.now(),
        attempts: 3,
      }
    );

    res.status(201).json(order[0]);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: "Error creando la orden" });
  }
};


// OBTENER PEDIDO POR ID
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const  id  = req.params.id as string;
    
    const order = await Order.findOne({
      _id: id
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