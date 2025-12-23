import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { motion } from "framer-motion";
import Loading from "../ui/Loading";
import Alert from "../ui/Alert";
import { useUserStore } from "../../store/userStore";


const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function DeleteProduct() {
    const user = useUserStore((state) => state.user);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({
  open: false,
  message: "",
  type: "info" as "info" | "success" | "error",
});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const handleDeleteClick = (product: any) => {
  setSelectedProduct(product);
  setConfirmOpen(true);
};

//Eliminar producto
  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/products/${selectedProduct._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar producto");

      setAlert({ open: true, message: "Producto eliminado con éxito", type: "success" });
      setProducts(products.filter((p: any) => p._id !== selectedProduct._id));
    } catch (err) {
      setAlert({ open: true, message: "No se pudo eliminar el producto", type: "error" });
    } finally {
      setConfirmOpen(false);
      setSelectedProduct(null);
    }
  };

  //Obtener productos del usuario logueado
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products/user/${user?.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener productos");

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Hubo un problema al cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-4 grid gap-4">
      {loading && <Loading />}
      {alert && <Alert
        open={alert.open}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, open: false })} />}
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No tenés productos creados aún.</p>
      ) : (
        products.map((product: any) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="rounded-2xl shadow-md p-3">
              <CardContent className="p-0">

                <div className="flex flex-col gap-2">
                  {product.imageUrl && product.imageUrl.length > 0 && (
                    <img
                      src={product.imageUrl}
                      alt="Producto"
                      className="rounded-xl w-full max-h-48 object-cover"
                    />
                  )}
                  <div className="flex flex-row justify-around">
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold">{product.title}</h2>
                      <p className="text-xs text-blue-600 uppercase font-bold">{product.category}</p>
                      {product.description && <p className="text-gray-600 text-sm">{product.description}</p>}
                    </div>
                    <p className="font-semibold">${product.price}</p>
                  </div>


                  <Button className="bg-red-600" onClick={() => handleDeleteClick(product)}>Eliminar</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">¿Eliminar producto?</h2>
            <p className="text-sm text-gray-600 mb-6">
              Estás por eliminar <strong>{selectedProduct?.title}</strong>. ¿Querés continuar?
            </p>
            <div className="flex justify-end gap-3">
              <Button className="bg-gray-400" onClick={() => setConfirmOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-red-600" onClick={confirmDelete}>
                Aceptar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
