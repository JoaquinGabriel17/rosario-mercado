import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast, {Toaster} from "react-hot-toast";
import { useUserStore } from "../store/userStore";
import axios from "axios";
import { useNotificationStore } from "../store/notificationsStore";
import { playNotificationSound } from "../utils/playNotificationSound";



const MainLayout = () => {
  const user = useUserStore((state) => state.user);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const socket = io(backendUrl);
  const { setNotifications } = useNotificationStore();
  const addNotification = useNotificationStore((state) => state.addLastNotification);
  const [ currentNotif, setCurrentNotif ] = useState<any>(null);
  const navigate = useNavigate();

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
        // Reproducir sonido de notificación
        setCurrentNotif(notification)
        playNotificationSound();
        addNotification(notification);
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
      { currentNotif && <div onClick={() => navigate(currentNotif.link)}></div>}
      <Toaster position="top-center" />
      <div className="mb-20">
      <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
