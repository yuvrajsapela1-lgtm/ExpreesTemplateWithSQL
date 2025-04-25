import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import APIResponse from "../utils/APIResponse.js";
import APIError from "../utils/APIError.js";

const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, role: true },
      });
      next();
    } catch (error) {
      throw new APIError("Not authorized, token failed", 401);
    }
  } else {
    throw new APIError("Not authorized, no token", 401);
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new APIError("Access forbidden: insufficient role", 403);
    } else {
      next();
    }
  };
};

export { protect, authorizeRoles };