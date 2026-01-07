// order.dal.ts
import { Order, OrderDocument } from "./order.model";
import {  UpdateQuery } from "mongoose";
import { QueryFilter } from "mongoose";
import { ProductDAL } from "../products/product.DAL";

const productDal = new ProductDAL();

export class OrderDAL {
  async create(data: Partial<OrderDocument>): Promise<OrderDocument> {
    return await Order.create(data);
  }

  async findById(id: string): Promise<OrderDocument | null> {
    return await Order.findById(id);
  }

  async findAll(filter: QueryFilter<OrderDocument> = {}): Promise<OrderDocument[]> {
    return await Order.find(filter).sort({ createdAt: -1 });
  }

  async update(id: string, update: UpdateQuery<OrderDocument>): Promise<OrderDocument | null> {
    return await Order.findByIdAndUpdate(id, update, { new: true });

  };

  async findByBuyerId(userId: string): Promise<OrderDocument[]> {
    return await Order.find({ buyerId: userId }).sort({ createdAt: -1 }).populate("items.productId");
  };

  async findBySellerId(userId: string): Promise<OrderDocument[]>{
    return await Order.find({ sellerId: userId }).sort({ createdAt: -1}).populate("items.productId");
  };

  async increaseSoldCount(orderId: string): Promise<void> {
    
    const order = await this.findById(orderId);
    console.log("Aumentando contador de ventas para la orden:", order);
    if (order) {
      for (const item of order.items) {
        await productDal.incrementSoldCount(item.productId.toString(), item.quantity);
      };
      return;
    };
    throw new Error("Orden no encontrada para aumentar el contador de ventas");
  };

  async getByIdWithProductsInfo(id: string): Promise<OrderDocument | null> {
    return await Order.findById(id).populate("items.productId");
  }
}