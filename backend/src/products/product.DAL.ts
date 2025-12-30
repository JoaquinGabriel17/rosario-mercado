import Product from "./Product.model";

export class ProductDAL {
  async decrementStock(productId: string, quantity: number) {
    // Buscamos el producto Y verificamos que el stock sea suficiente en la misma consulta
    return await Product.findOneAndUpdate(
      { 
        _id: productId, 
        stock: { $gte: quantity } // Solo si el stock es mayor o igual a lo pedido
      },
      { 
        $inc: { stock: -quantity } // Restamos la cantidad
      },
      { new: true }
    );
  }
}