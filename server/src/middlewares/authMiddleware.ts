// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/environment";
import User from "../models/User";
import { IUser } from "../types/custom";
import { logger } from "../utils/logger"; // <--- IMPORT THE LOGGER

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      logger.debug(`Attempting to verify token: ${token.substring(0, 10)}...`); // Log a snippet of the token

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
      logger.info(
        `Token verified for user ID: ${decoded.id}, Role: ${decoded.role}`
      );

      // Attach user to the request object
      // Select -password to exclude the password hash
      req.user = (await User.findById(decoded.id).select("-password")) as IUser;

      if (!req.user) {
        logger.warn(
          `Authentication failed: User with ID ${decoded.id} not found in DB.`
        );
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      logger.info(
        `User ${req.user.email} (${req.user.role}) authenticated successfully.`
      );
      next();
    } catch (error: any) {
      logger.error(
        `Authentication token verification failed: ${error.message}`,
        {
          tokenProvided: token ? token.substring(0, 10) + "..." : "none",
          errorStack: error.stack, // Include stack for detailed error inspection
        }
      );
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    logger.warn(
      "Authentication failed: No token provided in Authorization header."
    );
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      // This case should ideally be caught by 'protect' middleware before 'authorizeRoles'
      logger.warn(
        `Authorization check failed: No user attached to request. Roles required: ${roles.join(
          ", "
        )}`
      );
      res.status(401); // Unauthorized if user is missing
      throw new Error("Not authorized, user information missing");
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `Authorization failed for user ${req.user.email} (Role: ${
          req.user.role
        }). Required roles: ${roles.join(", ")}`
      );
      res.status(403);
      throw new Error(
        `User role ${req.user.role} is not authorized to access this route`
      );
    }
    logger.info(
      `User ${req.user.email} (Role: ${
        req.user.role
      }) authorized for roles: ${roles.join(", ")}`
    );
    next();
  };
};
