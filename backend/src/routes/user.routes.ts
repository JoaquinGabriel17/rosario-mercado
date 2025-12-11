import { Router } from "express";
import { register, login, updateInfo, forgotPassword, resetPassword } from "../controllers/user";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update", auth, updateInfo)
router.post("/forgotPassword", forgotPassword)
router.post("/resetPassword",  resetPassword)

export default router;
