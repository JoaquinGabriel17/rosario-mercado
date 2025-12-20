import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ProductResponse } from "../types/product";
import Loading from "../components/ui/Loading";
import CopyInfoButton from "../utils/CopyInfoButton";

const backendUrl = import.meta.env.VITE_BACKEND_URL
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);

export const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("ID de producto no proporcionado.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ajustá la URL base según tu backend
        const res = await fetch(`${backendUrl}/products/${productId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError("Producto no encontrado.");
          } else {
            setError(`Error al obtener el producto: ${res.statusText}`);
          }
          setData(null);
          setLoading(false);
          return;
        }

        const json: ProductResponse = await res.json();
        setData(json);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError("Ocurrió un error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    return () => controller.abort();
  }, [productId]);


  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        { loading && <Loading></Loading>}
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <p className="font-medium">Error</p>
          <p className="mt-2">{error}</p>
          <div className="mt-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { product, user } = data;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Producto */}
      <section className="bg-white shadow rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-black rounded flex items-center justify-center p-6">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-64 object-contain rounded"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}
          </div>

          <div className="md:w-2/3 p-6">
            <h1 className="text-2xl font-semibold text-gray-800">{product.title}</h1>
            <p className="mt-2 text-gray-600">{product.description}</p>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-3xl font-bold text-green-600">{formatCurrency(product.price)}</span>
              <span className="px-2 py-1 bg-gray-100 text-sm rounded text-gray-700">{product.category}</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-800">Stock</p>
                <p>{product.stock}</p>
              </div>
            </div>
            <p className="p-2 text-center">Abajo tienes información del vendedor para contactarlo para comprar el producto.</p>
            {/*
            
            <div className="mt-6 flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Comprar
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                Agregar al carrito
              </button>
            </div>
            */}
          </div>
        </div>
      </section>

      {/* Usuario */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800">Vendedor</h2>

        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <p className="font-medium text-gray-800">{user.name}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {user.phoneNumber && (
              <CopyInfoButton phoneNumber={user.phoneNumber} textInButton="Copiar número de teléfono" />
            )}
            {user.whatsappAvailable && user.phoneNumber && (
              <a
                href={`https://wa.me/${user.phoneNumber}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 border bg-green-600 text-white rounded hover:bg-green-700 text-center"
              >
                WhatsApp
              </a>
            )}
            <button
              onClick={() => navigate(`/users/${user._id}`)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-center"
            >
              Ver perfil
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <p className="font-medium text-gray-800">Horario de atención</p>
            <p>{user.businessHours ?? "-"}</p>
          </div>
          <div>
            <p className="font-medium text-gray-800">Entrega a domicilio</p>
            <p>{user.delivery ? "Sí" : "No"}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <p className="font-medium text-gray-800">Redes sociales</p>
          {!user.facebookUrl && !user.instagramUrl && <p>El usuario no tiene redes sociales disponibles.</p>}
          {user.facebookUrl && (
            <a
              href={user.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Facebook
            </a>
          )}
          {user.instagramUrl && (
            <a
              href={user.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-pink-600 hover:underline"
            >
              Instagram
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;