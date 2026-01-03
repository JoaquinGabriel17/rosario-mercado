import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useEffect } from "react";
import { io } from "socket.io-client";
import toast, {Toaster} from "react-hot-toast";
import { useUserStore } from "../store/userStore";



const MainLayout = () => {
  const user = useUserStore((state) => state.user);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const socket = io(backendUrl);

  useEffect(() => {
    if (user) {
      // 1. Unirse a la sala personal al entrar
      socket.emit('join_user_room', user.id);

      // 2. Escuchar notificaciones
      socket.on('new_notification', (notification) => {
        // A. Mostrar Toast (Popup visual bonito)
        toast(notification.message, {
            icon: '🍔',
            duration: 5000,
        });
        
        // B. Aquí también deberías actualizar el estado global 
        // del contador de notificaciones (Redux, Zustand, Context)
        // updateNotificationCount((prev) => prev + 1);
      });
    }

    return () => {
      socket.off('new_notification');
    };
  }, [user]);

  return (
    <>
      <Navbar />
      <Toaster position="top-right"/>
      <div className="mb-20">
      <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
