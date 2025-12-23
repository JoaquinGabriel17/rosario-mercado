import { Worker } from "bullmq";
import mongoose from "mongoose";
import { redisConnection } from "../lib/redis";
import { Order } from "../orders/order.model";
import Product from "../models/Product";
import { connectDB } from "../config/db";

(async () => {
  await connectDB();
  console.log("🟢 Mongo conectado en worker");

  new Worker(
    "order-expiration",
    async job => {
      console.log("⏰ Job recibido:", job.data);

      const { orderId } = job.data;
      const session = await mongoose.startSession();

      try {
        session.startTransaction();

        const order = await Order.findById(orderId).session(session);

        if (!order) {
          await session.commitTransaction();
          return;
        }

        if (order.status !== "pending_payment") {
          await session.commitTransaction();
          return;
        }

        order.status = "expired";
        await order.save({ session });

        for (const item of order.items) {
          await Product.updateOne(
            { _id: item.productId },
            { $inc: { reservedStock: -item.quantity } },
            { session }
          );
        }

        await session.commitTransaction();
        console.log("✅ Orden expirada:", orderId);

      } catch (error) {
        await session.abortTransaction();
        console.error("❌ Error expirando orden", error);
        throw error;
      } finally {
        session.endSession();
      }
    },
    { connection: redisConnection }
  );

  console.log("🟢 Worker de expiración activo");
})();
