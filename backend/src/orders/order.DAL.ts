// order.dal.ts
import { Order, OrderDocument } from "./order.model";
import {  UpdateQuery } from "mongoose";
import { QueryFilter } from "mongoose";

export class OrderDAL {
  async create(data: Partial<OrderDocument>): Promise<OrderDocument> {
    return await Order.create(data);
  }

  async findById(id: string): Promise<OrderDocument | null> {
    return await Order.findById(id).populate("items.productId");
  }

  async findAll(filter: QueryFilter<OrderDocument> = {}): Promise<OrderDocument[]> {
    return await Order.find(filter).sort({ createdAt: -1 });
  }

  async update(id: string, update: UpdateQuery<OrderDocument>): Promise<OrderDocument | null> {
    return await Order.findByIdAndUpdate(id, update, { new: true });
  }
}