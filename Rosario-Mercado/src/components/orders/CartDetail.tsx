import React, { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';
import Alert from '../ui/Alert';
import Loading from '../ui/Loading';
import axios from 'axios';
import { useUserStore } from '../../store/userStore';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface CreateOrderResponse {
  message: string;
  orderId: string;
  init_point: string;
}

// Iconos (SVG inline para no depender de librerías)
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

export const CartPage: React.FC = () => {
    const { items, addItem, decreaseItem, removeItem, clearCart, getTotalPrice } = useCartStore();
    const totalPrice = getTotalPrice();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "info" as "info" | "success" | "error",
    });
    const user = useUserStore((state) => state.user);


  // Función simulada para "Volver atrás" (dependerá de tu routing: react-router-dom, wouter, etc.)
  const handleGoBack = () => {
    window.history.back(); 
  };

    const createOrderAndPay = async () => {
        
  try {
    setLoading(true);
    // 1️⃣ Validación obligatoria
    if (!items || items.length === 0) {
      setAlert({
        open: true,
        message: "El carrito está vacío",
        type: "error",
      });
      return;    
    }

    // 2️⃣ Request al backend
    const response = await axios.post<CreateOrderResponse>(
      `${backendUrl}/orders/`,
      { items },
      {
        headers: {
          "Content-Type": "application/json",
          "Bearer": `Bearer ${user?.token}`,
        },
      }
    );

    const { init_point } = response.data;

    // 3️⃣ Redirección al checkout
    if (init_point) {
        setAlert({
        open: true,
        message: `Se creó el pedido correctamente, serás redirigido al pago. Puedes acceder al mismo desde este link: ${init_point}`,
        type: "success",
    });
      window.open(init_point, "_blank");
    } else {
        setAlert({
        open: true,
        message: "No se recibió el link de pago",
        type: "error",
    });
    }

  } catch (error: any) {
    console.error("Error al crear la orden:", error);

    setAlert({
        open: true,
        message: "Ocurrió un error inesperado al crear la orden",
        type: "error",
    });
  }
  finally{
    setLoading(false);
  }
};

  // VISTA: Carrito Vacío
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 pb-24">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 text-center mb-6">Parece que aún no has agregado productos.</p>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-600 transition">
          Empezar a comprar
        </button>
      </div>
    );
  }

  // VISTA: Carrito con Productos
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        {loading && <Loading />}
        {alert && <Alert
  open={alert.open}
  message={alert.message}
  type={alert.type}
  onClose={() => setAlert({ ...alert, open: false })}/>}
      
      {/* HEADER FIJO */}
      <header className="sticky top-0 bg-white shadow-sm z-40 px-4 py-4 flex items-center justify-between">
        <button onClick={handleGoBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ChevronLeftIcon />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Mi Carrito ({items.length})</h1>
        <button 
          onClick={clearCart} 
          className="text-sm text-blue-500 font-medium hover:underline"
        >
          Limpiar
        </button>
      </header>

      {/* LISTA DE PRODUCTOS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-[200px]"> 
        {/* pb-[200px] es importante para que el último item no quede tapado por el footer de checkout y el footer de navegación */}
        
        {items.map((item: any) => (
          <div key={item.productId} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Imagen del producto (placeholder si no hay) */}
            <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0 overflow-hidden"
                onClick={() => navigate(`/products/${item.productId}`)}
            >
               {item.image ? (
                 <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs text-center p-1">No img</div>
               )}
            </div>

            {/* Info y Controles */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <h3 onClick={() => navigate(`/products/${item.productId}`)}
                 className="text-gray-800 font-semibold line-clamp-2 leading-tight">{item.name}</h3>
                <button 
                  onClick={() => removeItem(item.productId)}
                  className="text-gray-400 hover:text-blue-500 p-1 -mt-1 -mr-1"
                >
                  <TrashIcon />
                </button>
              </div>

              <div className="flex justify-between items-end mt-2">
                <p className="text-blue-500 font-bold">${item.price * item.quantity}</p>
                
                {/* Controles de Cantidad */}
                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                  <button 
                    onClick={() => decreaseItem(item.productId)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-l-lg active:bg-gray-300"
                  >
                    <MinusIcon />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                  <button 
                    onClick={() => addItem(item)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-r-lg active:bg-gray-300"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER DE CHECKOUT (Flotante sobre el Footer de Navegación) */}
      <div className="fixed bottom-20 left-0 w-full px-4 pb-2 pt-0 z-30">
        <div className="bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500">Total a pagar</span>
                <span className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
            </div>
            <button 
                onClick={() => createOrderAndPay()}
            className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 active:scale-[0.98] transition-all">
                Finalizar Compra
            </button>
        </div>
      </div>

    </div>
  );
};