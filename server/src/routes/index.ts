// src/routes/index.ts
import { Router } from "express";
import authRoutes from "./authRoutes";
import pizzaRoutes from "./pizzaRoutes";
import orderRoutes from "./orderRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/pizzas", pizzaRoutes);
router.use("/orders", orderRoutes);

export default router;
