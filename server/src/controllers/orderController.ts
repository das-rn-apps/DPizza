import { Request, Response, NextFunction } from "express";
import Order, { IOrderItem } from "../models/Order";
import Pizza from "../models/Pizza";
import { Types } from "mongoose";
import { logger } from "../utils/logger"; // <--- IMPORT THE LOGGER

// @desc    Create new order
// @route   POST /api/orders
// @access  Public or Private
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.debug("Attempting to create a new order.", {
    payload: req.body,
    userId: req.user?._id || "guest",
  });
  const { items, shippingAddress, paymentMethod } = req.body;
  let { totalAmount } = req.body; // Frontend total, will be recalculated

  if (!items || !Array.isArray(items) || items.length === 0) {
    logger.warn("Order creation failed: No order items provided.", {
      payload: req.body,
    });
    res.status(400).json({ message: "No order items provided" });
    return;
  }

  if (!shippingAddress || !paymentMethod) {
    logger.warn(
      "Order creation failed: Missing shipping address or payment method.",
      { payload: req.body }
    );
    res
      .status(400)
      .json({ message: "Shipping address and payment method are required" });
    return;
  }

  try {
    let calculatedTotal = 0;
    const orderItems: IOrderItem[] = [];

    for (const item of items) {
      logger.debug(`Processing order item for pizza ID: ${item.pizzaId}`);
      const pizza = await Pizza.findById(item.pizzaId);
      if (!pizza) {
        logger.warn(
          `Order creation failed: Pizza not found for ID: ${item.pizzaId}.`,
          { itemId: item.pizzaId }
        );
        res
          .status(404)
          .json({ message: `Pizza with ID ${item.pizzaId} not found` });
        return;
      }

      const selectedSize = item.selectedSize;
      logger.debug(`Selected size for pizza ${pizza.name}: ${selectedSize}`);

      // Convert the price map to an object for proper key access
      const priceObj = Object.fromEntries(
        pizza.price as unknown as Map<string, number>
      );
      logger.debug("Converted Pizza Price Object:", priceObj);

      const backendPrice = priceObj[selectedSize];
      logger.debug(
        `Backend price for ${pizza.name} (${selectedSize}): ${backendPrice}`
      );

      if (backendPrice === undefined) {
        logger.error(
          `Selected size "${selectedSize}" not found in price map for pizza: ${pizza.name} (ID: ${pizza._id}).`,
          { pizzaId: pizza._id, selectedSize }
        );
        res.status(400).json({
          message: `Selected size "${selectedSize}" not available for ${pizza.name}`,
        });
        return;
      }

      if (backendPrice !== item.price) {
        logger.warn(
          `Price mismatch for ${pizza.name} [${selectedSize}]: Frontend ${item.price}, Backend ${backendPrice}. Using backend price for security.`
        );
        item.price = backendPrice; // Always use backend price for security
      }

      calculatedTotal += backendPrice * item.quantity;

      orderItems.push({
        pizzaId: pizza._id as Types.ObjectId,
        name: pizza.name,
        image: pizza.image,
        price: backendPrice,
        quantity: item.quantity,
        selectedSize,
      });
    }

    const deliveryFee = calculatedTotal > 0 ? 5.0 : 0.0; // Example delivery fee
    const tax = calculatedTotal * 0.08; // Example tax rate
    totalAmount = calculatedTotal + deliveryFee + tax;

    logger.debug(`Final calculated total for order: ${totalAmount.toFixed(2)}`);

    const order = new Order({
      user: req.user ? req.user._id : null,
      items: orderItems, // Use the server-verified order items
      shippingAddress,
      paymentMethod,
      totalAmount: parseFloat(totalAmount.toFixed(2)), // Ensure 2 decimal places for storage
      orderDate: new Date(),
      status: "Pending",
    });

    const createdOrder = await order.save();
    logger.info(
      `New order created successfully: ID ${createdOrder._id} for user ${
        req.user?.email || "guest"
      }. Total: ${createdOrder.totalAmount}`
    );

    res.status(201).json(createdOrder);
  } catch (error: any) {
    // Type error as any to access properties
    logger.error(`Error during order creation: ${error.message}`, {
      userId: req.user?._id || "guest",
      payload: req.body,
      errorStack: error.stack,
    });
    next(error); // Pass error to global error handler
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.debug(
    `Attempting to fetch order by ID: ${req.params.id} for user ${
      req.user?.email || "unknown"
    }.`
  );
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      logger.warn(`Order not found with ID: ${req.params.id}.`);
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Authorization check: User can view their own orders or if they are admin
    if (
      req.user &&
      (order.user?.toString() === req.user._id.toString() ||
        req.user.role === "admin")
    ) {
      logger.info(
        `Order ${order._id} fetched successfully by user ${req.user.email} (Role: ${req.user.role}).`
      );
      res.status(200).json(order);
    } else {
      logger.warn(
        `Unauthorized access attempt: User ${req.user?.email} (ID: ${req.user?._id}) tried to view order ${order._id} which doesn't belong to them.`
      );
      res.status(403).json({ message: "Not authorized to view this order" });
    }
  } catch (error: any) {
    logger.error(
      `Error fetching order by ID ${req.params.id}: ${error.message}`,
      {
        userId: req.user?._id,
        errorStack: error.stack,
      }
    );
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.debug(
    `Attempting to fetch orders for logged-in user: ${req.user?.email} (ID: ${req.user?._id}).`
  );
  try {
    if (!req.user) {
      logger.warn(
        "Failed to fetch user orders: No user found in request (authentication missing)."
      );
      res.status(401).json({ message: "Not authorized, user not found" });
      return;
    }

    const orders = await Order.find({ user: req.user._id }).sort({
      orderDate: -1,
    });
    logger.info(
      `User ${req.user.email} fetched ${orders.length} of their orders.`
    );
    res.status(200).json(orders);
  } catch (error: any) {
    logger.error(
      `Error fetching user's orders for user ${req.user?.email}: ${error.message}`,
      {
        userId: req.user?._id,
        errorStack: error.stack,
      }
    );
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.debug(
    `Attempting to update status for order ID: ${req.params.id} to "${req.body.status}" by user ${req.user?.email}.`
  );
  const { status } = req.body;

  if (!status) {
    logger.warn(
      `Order status update failed for ID ${req.params.id}: Missing status in request body.`,
      { payload: req.body }
    );
    res.status(400).json({ message: "Status is required" });
    return;
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      logger.warn(
        `Order status update failed: Order not found with ID: ${req.params.id}.`
      );
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const oldStatus = order.status;
    order.status = status;
    logger.debug(
      `Updating order ${order._id} status from "${oldStatus}" to "${status}".`
    );

    if (status === "Delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
      logger.info(
        `Order ${order._id} marked as Delivered, setting deliveredAt timestamp.`
      );
    } else if (status !== "Delivered" && order.deliveredAt) {
      order.deliveredAt = undefined; // Clear deliveredAt if status is no longer 'Delivered'
      logger.debug(
        `Cleared deliveredAt for order ${order._id} as status changed from Delivered.`
      );
    }

    const updatedOrder = await order.save();
    logger.info(
      `Order ${updatedOrder._id} status successfully updated to "${updatedOrder.status}" by ${req.user?.email}.`
    );
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    logger.error(
      `Error updating order status for ID ${req.params.id}: ${error.message}`,
      {
        payload: req.body,
        user: req.user?.email,
        errorStack: error.stack,
      }
    );
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin
// @access  Private/Admin (assuming this route is for admins only based on the name)
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.debug(`Admin user ${req.user?.email} attempting to fetch all orders.`);
  try {
    const orders = await Order.find({})
      .populate("user", "id name email") // Populate user details for admin view
      .sort({ orderDate: -1 });

    logger.info(
      `Admin user ${req.user?.email} successfully fetched ${orders.length} orders.`
    );
    res.status(200).json(orders);
  } catch (error: any) {
    logger.error(
      `Error fetching all orders for admin user ${req.user?.email}: ${error.message}`,
      {
        user: req.user?.email,
        errorStack: error.stack,
      }
    );
    next(error);
  }
};
