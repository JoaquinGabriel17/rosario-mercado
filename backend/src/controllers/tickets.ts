import { Request, Response } from "express";
import { Ticket } from "../models/Ticket";
import { Message } from "../models/Message";
import User from "../models/User";
import mongoose from "mongoose";
import { AuthRequest } from "../middlewares/auth";

// Crear ticket
export const createTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;
    const userId = req.user.id
    if(!title ) res.status(400).json({ message: "Faltan datos obligatorios"});
    
    const user = await User.findById(userId);
    const ticket = await Ticket.create({ userId, title });
  
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error creando ticket" });
  }
};

// Obtener tickets de un usuario
export const getUserTickets = async (req: Request, res: Response) => {
  try {
    const  userId  = req.params.userId as string;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: "El formato de userId es inválido" });
    }
    
    const tickets = await Ticket.find({ userId }).sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo tickets" });
  }
};

// Obtener mensajes de un ticket
export const getTicketMessages = async (req: Request, res: Response) => {
  try {
    const  ticketId  = req.params.ticketId as string;
    const messages = await Message.find({ ticketId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo mensajes" });
  }
};

// Agregar mensaje a un ticket
export const addMessageToTicket = async (req: AuthRequest, res: Response) => {
  try {
    const  ticketId  = req.params.ticketId as string;
    const { message, status } = req.body;
    
    const  ticket = await Ticket.findById(ticketId);
    if(!ticket) res.status(400).json({ message: "Ticket no encontrado"})
    
    const sender = await User.findById(req.user.id);
    if(!sender) res.status(400).json({ message: "Su usuario no fue encontrado"});

    const senderId = sender?.role as string;

    if(!message) res.status(400).json({ message: "Debe enviar un mensaje"});


    const newMessage = await Message.create({ ticketId, senderId, message });

    if(status){
        await Ticket.findByIdAndUpdate(ticketId, { status: status});
    }

    // actualizar fecha de última actividad del ticket
    await Ticket.findByIdAndUpdate(ticketId, { updatedAt: new Date() });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Error agregando mensaje", errorData: error });
  }
};

// Actualizar estado del ticket (solo admin)
export const updateTicketStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { ticketId } = req.params;
    if(!ticketId) res.status(400).json({ message: "Debe enviar un ticket ID"});

    const { status } = req.body;
    if(!status) res.status(400).json({ message: "Debe enviar un estado"});

    const user = await User.findById(req.user.id);

    if(!user) res.status(404).json({ message: "Usuario no encontrado"});
    if(user?.role !== "admin") res.status(401).json({ message: "Usuario no autorizado para actualizar estado de tickets"});

    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    );

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ error: "Error actualizando estado" });
  }
};