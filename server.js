import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import userRouter from "./router/userRouter.js";
import authRouter from "./router/authRouter.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();

app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "uploads")));
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

// Handle 404s for API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

// Handle 404s for other routes (including favicon.ico)
app.all(/(.*)/, (req, res, next) => {
  if (req.accepts("json")) {
    res.status(404).json({
      status: "error",
      message: `Can't find ${req.originalUrl} on this server`,
    });
  } else {
    res.status(404).send(`Can't find ${req.originalUrl} on this server`);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = statusCode === 500 ? "Something broke!" : err.message;

  if (req.accepts("json")) {
    res.status(statusCode).json({
      status: "error",
      message: message,
    });
  } else {
    res.status(statusCode).send(message);
  }
});
