import jwt from "jsonwebtoken";

const JWT_SECRET = "your-secret-key";
const JWT_EXPIRES_IN = "1h"; // or 3600

export const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};
