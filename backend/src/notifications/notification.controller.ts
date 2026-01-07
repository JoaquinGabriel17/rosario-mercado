import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { NotificationDAL } from "../notifications/notification.DAL";

const notificationDAL = new NotificationDAL();


// OBTENER NOTIFICACIONES POR ID DE USUARIO
export const findByUserId = catchAsync( async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;

    res.status(200).json((await notificationDAL.findByUserId(userId)).slice(0, 30));
});

export const markAllAsRead = catchAsync( async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;

    await notificationDAL.markAllAsRead(userId);

    res.status(200).json({ message: "Todas las notificaciones marcadas como leídas." });
});