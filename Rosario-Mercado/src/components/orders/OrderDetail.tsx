import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import type { Order } from '../../types/orders';
import Loading from '../ui/Loading';
import { useUserStore } from '../../store/userStore';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtiene el ID de la URL
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);

  const API_URL = `${import.meta.env.VITE_BACKEND_URL}/orders/${id}`;

  useEffect(() => {
    console.log("ID de la orden:", id);
    if (!id) return;

    // Obtener información del pedido
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setOrder(response.data);
      } catch (err) {
        setError('No se pudo cargar el detalle del pedido.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (loading) return <Loading />;
  if (error || !order) return <div className="text-center text-red-500 p-10">{error || 'Pedido no encontrado'}</div>;

  const totalOrder = order.items.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header con botón Back */}
      <div className="bg-white shadow-sm p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-800">Detalle del Pedido</h1>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">

        {/* Info General */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha</p>
              <p className="text-sm font-medium text-gray-800">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                  ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                order.status === 'expired' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`
            }>
              {order.status}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">ID de Transacción</p>
            <p className="text-sm text-gray-600 font-mono">{order._id}</p>
          </div>
        </div>

        {/* Lista de Productos */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-2 uppercase">Productos</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item._id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <img
                  src={item.productId.imageUrl}
                  alt={item.productId.title}
                  className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                />
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{item.productId.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{item.productId.description}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-sm text-gray-500">cant: {item.quantity}</p>
                    <p className="font-bold text-gray-800">${item.productId.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de Pago */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4">
          <div className="flex justify-between items-center text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>${totalOrder.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600 mb-4">
            <span>Envío</span>
            <span>$0.00</span>
          </div>
          <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
            <span className="font-bold text-gray-800 text-lg">Total</span>
            <span className="font-bold text-blue-600 text-xl">${totalOrder.toFixed(2)}</span>
          </div>
        </div>

        {/* Enlaces a información de usuarios */}
                  <div className='flex flex-col text-center'>
                    <a className='border-2 border-blue-600 rounded p-2 cursor-pointer m-2' onClick={() => navigate(`/users/${order.sellerId}`)}>Ver perfil de <strong>vendedor</strong></a>
                    <a className='border-2 border-blue-600 rounded p-2 cursor-pointer m-2' onClick={() => navigate(`/users/${order.buyerId}`)}>Ver perfil de <strong>comprador</strong></a>
                  </div>  
      </div>
    </div>
  );
};

export default OrderDetail;