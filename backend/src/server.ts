import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";




dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/users", userRoutes);
app.use("/products", productRoutes);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
