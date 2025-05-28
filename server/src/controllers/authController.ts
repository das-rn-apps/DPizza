import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { JWT_SECRET } from "../config/environment";
import { logger } from "../utils/logger"; // <--- IMPORT THE LOGGER

// Register a new user
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.debug("Attempting to register new user.", { payload: req.body }); // Log the incoming registration payload (careful with passwords in production debug)
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    logger.warn("User registration failed: Missing required fields.", {
      payload: req.body,
    });
    res.status(400).json({ message: "Please provide all required fields" });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      logger.warn(`User registration failed: Email already exists: ${email}`);
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUser = new User({ name, email, password, role: role || "user" });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    logger.info(
      `New user registered successfully: ${newUser.email} (ID: ${newUser._id}, Role: ${newUser.role})`
    );
    res.status(201).json({
      message: "User registered successfully",
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        token,
      },
    });
  } catch (err: any) {
    // Explicitly type err as any for stack access
    logger.error(`Error during user registration: ${err.message}`, {
      email,
      error: err,
      errorStack: err.stack,
    });
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message }); // Send just message to client
  }
};

// Authenticate user and get token
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  logger.debug("Attempting user login.", { email: req.body.email }); // Log email, avoid logging password
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn("User login failed: Missing email or password.", {
      payload: req.body,
    });
    res.status(400).json({ message: "Please provide email and password" });
    return;
  }

  try {
    const user = await User.findOne({ email }).select("+password"); // Select password for comparison

    if (!user) {
      logger.warn(`Login failed: User not found for email: ${email}`);
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const passwordMatch = await user.matchPassword(password);
    if (!passwordMatch) {
      logger.warn(`Login failed: Invalid password for email: ${email}`);
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    logger.info(
      `User logged in successfully: ${user.email} (ID: ${user._id}, Role: ${user.role})`
    );
    res.status(200).json({
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (err: any) {
    // Explicitly type err as any
    logger.error(`Error during user login: ${err.message}`, {
      email,
      error: err,
      errorStack: err.stack,
    });
    res.status(500).json({ message: "Login failed", error: err.message }); // Send just message to client
  }
};

// Get user profile
export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction // NextFunction is used if you pass errors to an error handling middleware
): Promise<void> => {
  logger.debug(`Attempting to get user profile for ID: ${req.user?._id}`); // req.user comes from protect middleware

  try {
    if (req.user) {
      logger.info(
        `Profile fetched successfully for user: ${req.user.email} (ID: ${req.user._id})`
      );
      res.status(200).json({
        message: "Profile fetched successfully",
        data: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
      });
    } else {
      logger.warn(
        "User profile request failed: User not found in request object (authentication issue?)."
      );
      res.status(404).json({ message: "User not found" });
    }
  } catch (err: any) {
    // Explicitly type err as any
    logger.error(`Error fetching user profile: ${err.message}`, {
      userId: req.user?._id,
      error: err,
      errorStack: err.stack,
    });
    next(err); // This still passes error to the next middleware (error handler)
  }
};
