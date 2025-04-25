//generateToken
//loginUser
//registerUser
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
import asyncHandler from "express-async-handler";
import APIResponse from "../utils/APIResponse.js";
import APIError from "../utils/APIError.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && (await bcrypt.compare(password, user.password))) {
    const responseData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    };
    return APIResponse.send(
      res,
      APIResponse.success(responseData, 200, "Login successful")
    );
  } else {
    throw new APIError("Invalid credentials", 401);
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await prisma.user.findFirst({
    where: { email },
  });
  if (userExists) {
    throw new APIError("User already exists", 400);
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });
  const responseData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user.id, user.role),
  };
  APIResponse.send(
    res,
    APIResponse.success(responseData, 201, "User registered successfully")
  );
});

export { loginUser, registerUser };
