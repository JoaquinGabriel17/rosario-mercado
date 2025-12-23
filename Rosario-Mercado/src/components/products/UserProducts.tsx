import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function UserProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useParams();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/products/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  if (loading) return <p className="text-center mt-10 text-lg">Cargando productos...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-4 grid gap-4">
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No tenés productos creados aún.</p>
      ) : (
        <div>
        {products.map((product: any) => (
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
                  

                  <Button onClick={() => navigate(`/products/edit/${product._id}`)}>Editar</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        </div>
      )}
    </div>
  );
}
