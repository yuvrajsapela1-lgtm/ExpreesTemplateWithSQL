import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/uploads/userAvatar");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = "avatar-"+Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });
const imageUpload = upload.single("avatar");

const createUser = asyncHandler(async (req, res) => {
  const { name, email, role, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      role,
      password: hashedPassword,
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      password: false,
    },
  });
  res.status(200).json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: Number(req.params.id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      password: false,
    },
  });
  res.status(200).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  if (data.password) data.password = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      password: false,
    },
  });
  res.status(200).json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.delete({
    where: { id: Number(req.params.id) },
  });
  res.status(200).json({ message: "user deleted successfully" });
});

export { imageUpload, createUser, getAllUsers, getUserById, updateUser, deleteUser };
