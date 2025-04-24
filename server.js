import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import userRouter from "./router/userRouter.js";
import authRouter from "./router/authRouter.js";
dotenv.config();
const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  console.log("======================================");
  console.log(`Mode: ${process.env.NODE_ENV}`);
  app.use(morgan("dev"));
  console.log("======================================");
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);

//solve html problem
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
