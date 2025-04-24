import { PrismaClient } from "@prisma/client";
import express from 'express';
import asyncHandler from "express-async-handler";
const prisma = new PrismaClient();

const router = express.Router();
// Create new user
router.post("/", asyncHandler(async (req, res) => {
    const { name, email, role, password } = req.body;
    const user = await prisma.user.create({
        data: { name, email, role, password },
    });
    res.json(user);
}));

// Get all users
router.get("/", asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
}));

// Get user by ID
router.get("/:id", asyncHandler(async (req, res) => {
    const user = await prisma.user.findFirst({
        where: { id: Number(req.params.id) },
    });
    res.status(200).json(user);
}));

// Update user
router.put("/:id", asyncHandler(async (req, res) => {
    const user = await prisma.user.update({
        where: { id: Number(req.params.id) },
        data: req.body,
    });
    res.status(200).json(user);
}));

// Delete user
router.delete("/:id", asyncHandler(async (req, res) => {
    const user = await prisma.user.delete({
        where: { id: Number(req.params.id) },
    });
    res.status(200).json({ message: "user deleted successfully" });
}));

export default router;
