// src/routes/orderRoutes.ts
import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController";
import { protect, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

// Public route for creating an order (can be used by guests or logged-in users)
router.post("/", protect, createOrder);

// Private routes for users
router.get("/myorders", protect, getMyOrders); // Get logged-in user's orders
router.get("/:id", protect, getOrderById); // Get a specific order by ID (must be owner or admin)

// Admin routes
router.get("/", protect, authorizeRoles("admin"), getAllOrders); // Get all orders
router.put("/:id/status", protect, authorizeRoles("admin"), updateOrderStatus); // Update order status

export default router;
