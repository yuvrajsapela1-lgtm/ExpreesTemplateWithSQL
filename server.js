import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();
const app = express();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  console.log("======================================");
  console.log(`Mode: ${process.env.NODE_ENV}`);
  app.use(morgan("dev"));
  console.log("======================================");
}

app.post("/createUser", async (req, res) => {
  const { name, email, role, password } = req.body;
  const user = await prisma.user.create({
    data: { name, email, role, password },
  });
  res.json(user);
});

app.get("/getAllUsers", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Failed to fetch users", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.get("/getUser/:id", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: Number(req.params.id) },
  });
  res.status(200).json(user);
});

app.put("/updateUser/:id", async (req, res) => {
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.status(200).json(user);
});

app.delete("/deleteUser/:id", async (req, res) => {
  const user = await prisma.user.delete({
    where: { id: Number(req.params.id) },
  });
  res.status(200).json({ message: "user deleted sucessfuly" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
//  solve html problem
app.use((req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = 404;
  next(err);
  // next(new APIError(`Can't find ${req.originalUrl} on this server`,400))
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something broke!" });
});
