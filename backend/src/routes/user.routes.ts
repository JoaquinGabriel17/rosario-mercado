import { Router } from "express";
import { register, login, updateInfo, forgotPassword, resetPassword, getUserById } from "../controllers/user";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/register", register); // Registro
router.post("/login", login); // Inicio de sesión
router.put("/update", auth, updateInfo) //Actualizar información del usuario
router.post("/forgotPassword", forgotPassword) // Enviar correo para cambio de contraseña
router.post("/resetPassword",  resetPassword); // Cambiar contraseña
router.get("/:userId",  getUserById); // Obtener información del usuario

export default router;
