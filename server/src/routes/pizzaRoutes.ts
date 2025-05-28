// src/routes/pizzaRoutes.ts
import { Router } from "express";
import {
  getPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
} from "../controllers/pizzaController";
import { protect, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

// Public routes
router.get("/", getPizzas);
router.get("/:id", getPizzaById);

// Admin routes (requires authentication and 'admin' role)
router.post("/", protect, authorizeRoles("admin"), createPizza);
router.put("/:id", protect, authorizeRoles("admin"), updatePizza);
router.delete("/:id", protect, authorizeRoles("admin"), deletePizza);

export default router;
