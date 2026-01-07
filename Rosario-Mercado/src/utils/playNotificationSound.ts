export const playNotificationSound = () => {
  const audio = new Audio('/sounds/notif.mp3');
  audio.play().catch(err => console.error("Error al reproducir sonido:", err));
};