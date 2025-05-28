import { Request, Response, NextFunction } from "express";
import Pizza from "../models/Pizza";

// @desc    Get all pizzas
// @route   GET /api/pizzas
// @access  Public
export const getPizzas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pizzas = await Pizza.find({});
    res.status(200).json(pizzas);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pizza by ID
// @route   GET /api/pizzas/:id
// @access  Public
export const getPizzaById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      res.status(404);
      throw new Error("Pizza not found");
    }

    res.status(200).json(pizza);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new pizza
// @route   POST /api/pizzas
// @access  Private/Admin
export const createPizza = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      image,
      price,
      category,
      toppings,
      sizes,
      isVegetarian,
    } = req.body;

    if (
      !name ||
      !description ||
      !image ||
      !price ||
      typeof price !== "object" ||
      !category ||
      !sizes
    ) {
      res.status(400);
      throw new Error("Missing or invalid fields");
    }

    const pizza = new Pizza({
      name,
      description,
      image,
      price,
      category,
      toppings: toppings || [],
      sizes,
      isVegetarian: !!isVegetarian,
    });

    const createdPizza = await pizza.save();
    res.status(201).json(createdPizza);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a pizza
// @route   PUT /api/pizzas/:id
// @access  Private/Admin
export const updatePizza = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      res.status(404);
      throw new Error("Pizza not found");
    }

    const {
      name,
      description,
      image,
      price,
      category,
      toppings,
      sizes,
      isVegetarian,
    } = req.body;

    pizza.name = name ?? pizza.name;
    pizza.description = description ?? pizza.description;
    pizza.image = image ?? pizza.image;
    pizza.price = price ?? pizza.price;
    pizza.category = category ?? pizza.category;
    pizza.toppings = toppings ?? pizza.toppings;
    pizza.sizes = sizes ?? pizza.sizes;
    pizza.isVegetarian = isVegetarian ?? pizza.isVegetarian;

    const updatedPizza = await pizza.save();
    res.status(200).json(updatedPizza);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a pizza
// @route   DELETE /api/pizzas/:id
// @access  Private/Admin
export const deletePizza = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);

    if (!pizza) {
      res.status(404);
      throw new Error("Pizza not found");
    }

    res.status(200).json({ message: "Pizza removed" });
  } catch (error) {
    next(error);
  }
};
