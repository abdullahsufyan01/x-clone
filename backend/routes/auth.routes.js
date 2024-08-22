import e from "express";
import {  getMe, login, logout, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectedRoute.js";

const router = e.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup",signup);
router.post("/login", login);
router.post("/logout", logout);

export default router