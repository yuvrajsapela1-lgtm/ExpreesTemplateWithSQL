import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
import multer from "multer";
import { v4 as uuid } from "uuid";
import APIResponse from "../utils/APIResponse.js";
import APIError from "../utils/APIError.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/userAvatar");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const name = `avatar-${uuid()}-${Date.now()}.${ext}`;
    cb(null, name);
  },
});
const multerFilter = function (_, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new APIError("Only image files are allowed", 400), false);
  }
};
const upload = multer({ storage: storage, fileFilter: multerFilter });
const imageUpload = upload.single("avatar");

const createUser = asyncHandler(async (req, res) => {
  const { name, email, role, password } = req.body;
  const userExists = await prisma.user.findFirst({
    where: { email },
  });
  if (userExists) {
    throw new APIError("User with this email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const avatar = req.file ? req.file.filename : "avatar.png";

  const user = await prisma.user.create({
    data: {
      name,
      email,
      role,
      password: hashedPassword,
      avatar,
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  APIResponse.send(
    res,
    APIResponse.success(userWithoutPassword, 201, "User created successfully")
  );
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      password: false,
    },
  });
  APIResponse.send(
    res,
    APIResponse.success(users, 200, "Users retrieved successfully")
  );
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: Number(req.params.id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      password: false,
    },
  });

  if (!user) {
    throw new APIError("User not found", 404);
  }

  APIResponse.send(
    res,
    APIResponse.success(user, 200, "User retrieved successfully")
  );
});

const updateUser = asyncHandler(async (req, res) => {
  const userExists = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!userExists) {
    throw new APIError("User not found", 404);
  }

  const data = { ...req.body };
  if (data.password) data.password = await bcrypt.hash(data.password, 12);
  if (req.file) {
    data.avatar = req.file.filename;
  }

  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        password: false,
      },
    });
    APIResponse.send(
      res,
      APIResponse.success(user, 200, "User updated successfully")
    );
  } catch (error) {
    throw new APIError("Error updating user", 400);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const userExists = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!userExists) {
    throw new APIError("User not found", 404);
  }

  try {
    const user = await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });
    APIResponse.send(
      res,
      APIResponse.success({ message: "User deleted successfully" }, 200)
    );
  } catch (error) {
    throw new APIError("Error deleting user", 400);
  }
});

export {
  imageUpload,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
