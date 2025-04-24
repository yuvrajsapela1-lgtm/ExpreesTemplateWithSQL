//generateToken
//loginUser
//registerUser
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
import asyncHandler from "express-async-handler";

const generateToken = async (Id, role) => {
    await jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const loginUser = asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { email: req.email } });
    if (user && (await bcrypt.compare(req.password, user.password))) {
        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role),
        });
    } else {
        res.status(401);
        throw new Error("Invalid credentials");
    }
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const userExists = await prisma.user.findUnique({
        where: { email: req.email },
    });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
    });
    res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
    });
});

export { loginUser, registerUser };
