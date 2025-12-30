import { OrderDAL } from "./order.DAL";
import { AppError } from "../utils/AppError";
import { ProductDAL } from "../products/product.DAL";

const orderDal = new OrderDAL();
const productDal = new ProductDAL();

export const createOrder = async (items: any[]) => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  // 1. Mapeamos y procesamos el stock de cada item
  // Usamos Promise.all para que las consultas se ejecuten en paralelo (más rápido)
  await Promise.all(
    items.map(async (item) => {
      const updatedProduct = await productDal.decrementStock(
        item.productId,
        item.quantity
      );

      // 2. Si el DAL devuelve null, es porque no había stock suficiente
      if (!updatedProduct) throw new AppError(`Stock insuficiente para el producto con ID: ${item.productId}`,400);
    })
  );

  // 3. Una vez restado el stock de todos, creamos la orden
  return await orderDal.create({
    items,
    expiresAt,
    status: "pending_payment",
  });
};

export const getOrder = async (id: string) => {
  const order = await orderDal.findById(id);
  if (!order) throw new AppError("La orden solicitada no existe", 404);
  return order;
};

export const updateStatus = async (id: string, status: "paid" | "expired") => {
  const updatedOrder = await orderDal.update(id, { status });
  if (!updatedOrder) throw new AppError("No se pudo actualizar la orden", 404);
  return updatedOrder;
};