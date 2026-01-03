import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import { initSocket } from "./config/socket";
import { connectDB } from "./config/db";
import userRoutes from "./users/user.routes";
import productRoutes from "./products/product.routes";
import ticketRoutes from "./support/tickets.routes"
import { startExpireOrdersJob } from "./orderExpiration/expireOrders.job";
import orderRoutes from "./orders/order.routes";


const port = Number(process.env.PORT ?? 4000);


//process.env.PORT as any ||

const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());

const server = http.createServer(app);

initSocket(server);



// Rutas
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/tickets", ticketRoutes);
app.use("/orders", orderRoutes);

server.listen(port, "0.0.0.0", () => {
  connectDB();
  startExpireOrdersJob();
  console.log(`Servidor corriendo en puerto ${port}`);
});
