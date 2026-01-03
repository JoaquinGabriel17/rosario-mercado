import React from 'react';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {

  const navigate = useNavigate();

  // Obtenemos el total de items del store
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Función auxiliar para clases comunes de botones inactivos
  const navBtnClasses = "flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 transition-colors duration-200 gap-1";
  
  // Clase para el botón activo (simulado)
  const activeBtnClasses = "flex flex-col items-center justify-center text-blue-600 gap-1";

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-[70px] px-2 relative">
        
        {/* --- Botón Inicio (Activo) --- */}
        <button className={activeBtnClasses} onClick={() => navigate('/')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span className="text-[10px] font-medium">Inicio</span>
        </button>

        {/* --- Botón Compras --- */}
        <button className={navBtnClasses} onClick={() => console.log('Favs')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <span className="text-[10px] font-medium">Compras</span>
        </button>

        {/* --- BOTÓN CENTRAL (CARRITO) --- */}
        <div className="relative -top-6">
          <button 
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-gray-50 hover:bg-blue-600 transition-transform active:scale-95"
            onClick={() => navigate('/cart/detail')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>

            {/* Badge de cantidad */}
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-bold h-5 min-w-5 px-1 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        </div>

        {/* --- Botón Notificaciones --- */}
        <button className={navBtnClasses} onClick={() => console.log('Notif')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="text-[10px] font-medium">Alertas</span>
        </button>

        {/* --- Botón Perfil --- */}
        <button className={navBtnClasses} onClick={() => navigate('/dashboard')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span className="text-[10px] font-medium">Cuenta</span>
        </button>

      </div>
    </footer>
  );
};