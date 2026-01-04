import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast, {Toaster} from "react-hot-toast";
import { useUserStore } from "../store/userStore";
import axios from "axios";
import { useNotificationStore } from "../store/notificationsStore";



const MainLayout = () => {
  const user = useUserStore((state) => state.user);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const socket = io(backendUrl);
  const navigate = useNavigate();
  const { setNotifications } = useNotificationStore();
  const notification = useNotificationStore((state) => state.notifications[0]);
  const [ currentNotification, setCurrentNotification ] =  useState<null | typeof notification>(null);


  const getUserNotifications = async () => {
    
    

    try {
    const response = await axios.get(`${backendUrl}/notifications/user`, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });

    if (response.status === 200) {
      console.log('Notificaciones obtenidas con éxito');
      // Guardamos la información en el store de Zustand
      setNotifications(response.data);
    }
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    // Aquí podrías agregar lógica adicional, como notificar al usuario con un Toast
  }
  }

  useEffect(() => {
    if (user) {
      // Obtener notificaciones al cargar el layout
      getUserNotifications();
      // 1. Unirse a la sala personal al entrar
      socket.emit('join_user_room', user.id);

      // 2. Escuchar notificaciones
      socket.on('new_notification', (notification) => {
        // A. Mostrar Toast (Popup visual bonito)
        setCurrentNotification(notification);
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
      { currentNotification && <a onClick={() => navigate(currentNotification.link)} target="_blank"> <Toaster position="top-right"/> </a>}
      <div className="mb-20">
      <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
