// src/config/socket.ts
import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: { origin: "*" }, 
  });

  io.on("connection", (socket) => {
    socket.on("join_user_room", (userId) => {
      socket.join(userId);
    });
  });

  return io;
};

// Esta función permite obtener la instancia en cualquier parte del código
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io no ha sido inicializado");
  }
  return io;
};