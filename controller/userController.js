import { PrismaClient } from "@prisma/client";
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();

const createUser = asyncHandler(async (req, res) => {
    const { name, email, role, password } = req.body;
    const user = await prisma.user.create({
        data: { name, email, role, password },
    });
    res.json(user);
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await prisma.user.findFirst({
        where: { id: Number(req.params.id) },
    });
    res.status(200).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await prisma.user.update({
        where: { id: Number(req.params.id) },
        data: req.body,
    });
    res.status(200).json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await prisma.user.delete({
        where: { id: Number(req.params.id) },
    });
    res.status(200).json({ message: "user deleted successfully" });
});

export { createUser, getAllUsers, getUserById, updateUser, deleteUser };
