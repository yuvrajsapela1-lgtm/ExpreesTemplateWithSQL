import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createUser = async (req, res) => {
  const { name, email, role, password } = req.body;
  const user = await prisma.user.create({
    data: { name, email, role, password },
  });
  res.json(user);
};

const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
};

const getUserById = async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: Number(req.params.id) },
  });
  res.status(200).json(user);
};

const updateUser = async (req, res) => {
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.status(200).json(user);
};

const deleteUser = async (req, res) => {
  const user = await prisma.user.delete({
    where: { id: Number(req.params.id) },
  });
  res.status(200).json({ message: "user deleted successfully" });
};

export { createUser, getAllUsers, getUserById, updateUser, deleteUser };
