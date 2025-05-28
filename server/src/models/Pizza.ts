// src/models/Pizza.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPizza extends Document {
  name: string;
  description: string;
  image: string;
  price: {
    [key: string]: number; // Maps size to price (e.g., 'Small': 10, 'Medium': 12, 'Large': 15)
  };
  category: "Vegetarian" | "Non-Vegetarian" | "Vegan" | "Specialty" | "Other";
  toppings: string[];
  sizes: string[]; // e.g., ['Small', 'Medium', 'Large']
  isVegetarian: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PizzaSchema: Schema<IPizza> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Map,
      of: Number,
      required: true, // Ensures each size has a price
    },
    category: {
      type: String,
      enum: ["Vegetarian", "Non-Vegetarian", "Vegan", "Specialty", "Other"],
      default: "Other",
    },
    toppings: {
      type: [String], // Array of strings
      default: [],
    },
    sizes: {
      type: [String],
      default: ["Small", "Medium", "Large"], // Default sizes
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Pizza = mongoose.model<IPizza>("Pizza", PizzaSchema);

export default Pizza;
