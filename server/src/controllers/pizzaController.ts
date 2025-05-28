import { Request, Response, NextFunction } from "express";
import Pizza from "../models/Pizza";
import { logger } from "../utils/logger"; // <--- IMPORT THE LOGGER

// @desc    Get all pizzas
// @route   GET /api/pizzas
// @access  Public
export const getPizzas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug("Attempting to fetch all pizzas.");
  try {
    const pizzas = await Pizza.find({});
    logger.info(`Successfully fetched ${pizzas.length} pizzas.`);
    res.status(200).json(pizzas);
  } catch (error: any) {
    // Explicitly type error as any
    logger.error(`Error fetching all pizzas: ${error.message}`, {
      errorStack: error.stack,
    });
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
  logger.debug(`Attempting to fetch pizza by ID: ${req.params.id}.`);
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      logger.warn(`Pizza not found with ID: ${req.params.id}.`);
      res.status(404);
      throw new Error("Pizza not found");
    }

    logger.info(
      `Successfully fetched pizza: ${pizza.name} (ID: ${pizza._id}).`
    );
    res.status(200).json(pizza);
  } catch (error: any) {
    logger.error(
      `Error fetching pizza by ID ${req.params.id}: ${error.message}`,
      { errorStack: error.stack }
    );
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
  logger.debug("Attempting to create a new pizza.", {
    payload: req.body,
    user: req.user?.email,
  });
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
      typeof price !== "object" || // Expecting price to be an object (map of sizes to prices)
      !category ||
      !sizes ||
      !Array.isArray(sizes) ||
      sizes.length === 0 // Ensure sizes is an array and not empty
    ) {
      logger.warn(
        "Pizza creation failed: Missing or invalid required fields.",
        { payload: req.body, user: req.user?.email }
      );
      res.status(400);
      throw new Error(
        "Missing or invalid required fields (name, description, image, price, category, sizes are required, price must be an object)"
      );
    }

    const pizza = new Pizza({
      name,
      description,
      image,
      price, // Ensure this is an object like { "Small": 10.99, "Medium": 13.99 }
      category,
      toppings: toppings || [], // Default to empty array if not provided
      sizes,
      isVegetarian: !!isVegetarian, // Convert to boolean
    });

    const createdPizza = await pizza.save();
    logger.info(
      `New pizza created successfully: ${createdPizza.name} (ID: ${createdPizza._id}) by user ${req.user?.email}.`
    );
    res.status(201).json(createdPizza);
  } catch (error: any) {
    logger.error(`Error creating pizza: ${error.message}`, {
      payload: req.body,
      user: req.user?.email,
      errorStack: error.stack,
    });
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
  logger.debug(`Attempting to update pizza with ID: ${req.params.id}.`, {
    payload: req.body,
    user: req.user?.email,
  });
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      logger.warn(
        `Pizza update failed: Pizza not found with ID: ${req.params.id}.`
      );
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

    // Apply updates only if provided in the request body
    pizza.name = name !== undefined ? name : pizza.name;
    pizza.description =
      description !== undefined ? description : pizza.description;
    pizza.image = image !== undefined ? image : pizza.image;
    pizza.price = price !== undefined ? price : pizza.price; // Expect price to be an object
    pizza.category = category !== undefined ? category : pizza.category;
    pizza.toppings = toppings !== undefined ? toppings : pizza.toppings;
    pizza.sizes = sizes !== undefined ? sizes : pizza.sizes;
    pizza.isVegetarian =
      isVegetarian !== undefined ? isVegetarian : pizza.isVegetarian;

    const updatedPizza = await pizza.save();
    logger.info(
      `Pizza updated successfully: ${updatedPizza.name} (ID: ${updatedPizza._id}) by user ${req.user?.email}.`
    );
    res.status(200).json(updatedPizza);
  } catch (error: any) {
    logger.error(`Error updating pizza ID ${req.params.id}: ${error.message}`, {
      payload: req.body,
      user: req.user?.email,
      errorStack: error.stack,
    });
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
  logger.debug(
    `Attempting to delete pizza with ID: ${req.params.id} by user ${req.user?.email}.`
  );
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);

    if (!pizza) {
      logger.warn(
        `Pizza deletion failed: Pizza not found with ID: ${req.params.id}.`
      );
      res.status(404);
      throw new Error("Pizza not found");
    }

    logger.info(
      `Pizza deleted successfully: ${pizza.name} (ID: ${pizza._id}) by user ${req.user?.email}.`
    );
    res.status(200).json({ message: "Pizza removed" });
  } catch (error: any) {
    logger.error(`Error deleting pizza ID ${req.params.id}: ${error.message}`, {
      user: req.user?.email,
      errorStack: error.stack,
    });
    next(error);
  }
};
