import { Request, Response, NextFunction } from "express";
import Order, { IOrderItem } from "../models/Order";
import Pizza from "../models/Pizza";
import { Types } from "mongoose";

// @desc    Create new order
// @route   POST /api/orders
// @access  Public or Private
export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { items, shippingAddress, paymentMethod } = req.body;
  let { totalAmount } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: "No order items provided" });
    return;
  }

  if (!shippingAddress || !paymentMethod) {
    res
      .status(400)
      .json({ message: "Shipping address and payment method are required" });
    return;
  }

  try {
    let calculatedTotal = 0;
    const orderItems: IOrderItem[] = [];

    for (const item of items) {
      const pizza = await Pizza.findById(item.pizzaId);
      if (!pizza) {
        res
          .status(404)
          .json({ message: `Pizza with ID ${item.pizzaId} not found` });
        return;
      }

      const selectedSize = item.selectedSize;
      const backendPrice = pizza.price[selectedSize];

      if (backendPrice === undefined) {
        res.status(400).json({
          message: `Selected size "${selectedSize}" not available for ${pizza.name}`,
        });
        return;
      }

      if (backendPrice !== item.price) {
        console.warn(
          `Price mismatch for ${pizza.name} [${selectedSize}]: Frontend ${item.price}, Backend ${backendPrice}`
        );
        item.price = backendPrice;
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

    const deliveryFee = calculatedTotal > 0 ? 5.0 : 0.0;
    const tax = calculatedTotal * 0.08;
    totalAmount = calculatedTotal + deliveryFee + tax;

    const order = new Order({
      user: req.user ? req.user._id : null,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      orderDate: new Date(),
      status: "Pending",
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
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
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    if (
      req.user &&
      (order.user?.toString() === req.user._id.toString() ||
        req.user.role === "admin")
    ) {
      res.status(200).json(order);
    } else {
      res.status(403).json({ message: "Not authorized to view this order" });
    }
  } catch (error) {
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
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized, user not found" });
      return;
    }

    const orders = await Order.find({ user: req.user._id }).sort({
      orderDate: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
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
  const { status } = req.body;

  if (!status) {
    res.status(400).json({ message: "Status is required" });
    return;
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    order.status = status;

    if (status === "Delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    } else if (status !== "Delivered") {
      order.deliveredAt = undefined;
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name email")
      .sort({ orderDate: -1 });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
