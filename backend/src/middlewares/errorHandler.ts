// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  // 1. Loguear el error (aquí se usaría Winston o Pino en el futuro)
  console.error(`[ERROR]: ${message}`, { stack: err.stack });

  // 2. Enviar respuesta limpia al cliente
  res.status(statusCode).json({
    status: "error",
    message: message,
    // Solo enviamos el stack en desarrollo
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};