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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// if the route you send is not found | solve html problem
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
