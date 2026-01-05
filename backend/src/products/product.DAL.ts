import Product from "./Product.model";
import { sendNotification } from "../utils/sendNotification";

export class ProductDAL {
  async decrementStock(productId: string, quantity: number) {
    // Buscamos el producto Y verificamos que el stock sea suficiente en la misma consulta
    const updatedProduct = await Product.findById(productId);
    if(!updatedProduct) return null;
    if(updatedProduct.stock < quantity) return null;

    // Si el stock llega a 0 enviar notificación
    if(updatedProduct.stock === quantity){
      sendNotification({
        user: updatedProduct.userId,
        title: `El stock del producto ${updatedProduct.title} se ha agotado`,
        message: `¡Atención! El stock del producto ${updatedProduct.title} ha llegado a cero.`,
        link: `/products/${updatedProduct._id}`
      });
    };
    updatedProduct.stock -= quantity;
    await updatedProduct.save();
    return updatedProduct;
    
  };
  
  // incrementar stock
async incrementStock(productId: string, quantity: number) {
  return await Product.findByIdAndUpdate(
    productId,
    { $inc: { stock: quantity } },
    { new: true }
  );
};

// INCREMENTAR CONTADOR DE VENTAS
async incrementSoldCount(productId: string, quantity: number) {
  return await Product.findByIdAndUpdate(
    productId,
    { $inc: { soldCount: quantity } },
    { new: true }
  );
};

// BUSCAR POR ID
async findById(productId: string){
  return await Product.findById(productId);
}
};

