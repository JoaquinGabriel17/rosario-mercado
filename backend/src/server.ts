import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db";
import userRoutes from "./users/user.routes";
import productRoutes from "./products/product.routes";
import ticketRoutes from "./support/tickets.routes"





const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/tickets", ticketRoutes)

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
