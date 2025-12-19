import { Router } from "express";
import {
  createTicket,
  getUserTickets,
  getTicketMessages,
  addMessageToTicket,
  updateTicketStatus,
  getAllTickets
} from "../controllers/tickets";
import { auth } from "../middlewares/auth";

const router = Router();

// Crear ticket
router.post("/", auth, createTicket);

// Obtener tickets de un usuario
router.get("/user/:userId", auth, getUserTickets);

// Obtener mensajes de un ticket
router.get("/:ticketId/messages", auth, getTicketMessages);

// Agregar mensaje a un ticket
router.post("/:ticketId/messages", auth, addMessageToTicket);

// Actualizar estado del ticket (solo admin)
router.patch("/:ticketId/status", auth, updateTicketStatus);

//Obtener todos los tickets de todos los usuarios (solo admin)
router.get("/all", auth, getAllTickets);

export default router;