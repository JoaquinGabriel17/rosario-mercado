import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db";
import userRoutes from "./users/user.routes";
import productRoutes from "./products/product.routes";
import ticketRoutes from "./support/tickets.routes"
import { startExpireOrdersJob } from "./orderExpiration/expireOrders.job";
import orderRoutes from "./orders/order.routes";





const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/tickets", ticketRoutes);
app.use("/orders", orderRoutes);

app.listen(process.env.PORT, () => {
  connectDB();
  startExpireOrdersJob();
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
