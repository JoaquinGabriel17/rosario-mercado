import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { Order } from '../../types/orders';
import Loading from '../ui/Loading';
import { useUserStore } from '../../store/userStore';

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  // URL de API
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders/user/orders`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError('Error al cargar los pedidos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper para calcular total
  const calculateTotal = (order: Order) => {
    return order.items.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
  };

  // Helper para formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500 p-10">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Pedidos</h1>

        <div className="space-y-4">
          {orders.map((order) => {
            const total = calculateTotal(order);
            const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

            return (
              <div
                key={order._id}
                onClick={() => navigate(`/orders/detail/${order._id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 active:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs text-gray-500">ID: {order._id.slice(-6).toUpperCase()}</span>
                    <p className="text-sm text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize
                    ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                      order.status === 'expired' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`
                  }>
                    {order.status === 'paid' ? 'Pagado' : order.status === 'expired' ? 'Expirado' : order.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 border-t border-gray-100 pt-3 mt-2">
                  {/* Preview de la primera imagen */}
                  {order.items.length > 0 && (
                    <img
                      src={order.items[0].productId.imageUrl}
                      alt="Product"
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  )}

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                    </p>
                    <p className="text-blue-600 font-bold">
                      ${total.toFixed(2)}
                    </p>
                  </div>

                  <div className="text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersList;