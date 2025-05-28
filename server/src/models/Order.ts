// src/models/Order.ts
import mongoose, { Schema, Document } from "mongoose";

// Define the CartItem schema used within an Order
export interface IOrderItem {
  pizzaId: mongoose.Types.ObjectId; // Reference to Pizza model
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedSize: string;
  // Potentially add custom toppings here if implemented
}

const OrderItemSchema: Schema<IOrderItem> = new Schema({
  pizzaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pizza",
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedSize: { type: String, required: true },
});

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId; // Reference to User model (optional, for guest orders)
  items: IOrderItem[];
  shippingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    phone: string;
  };
  paymentMethod: "card" | "cash";
  totalAmount: number;
  status:
    | "Pending"
    | "Confirmed"
    | "Preparing"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
  orderDate: Date;
  deliveredAt?: Date; // Optional: When the order was delivered
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Can be null for guest orders
    },
    items: [OrderItemSchema], // Array of order items
    shippingAddress: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zip: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
