import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import userRouter from "./router/userRouter.js";
import authRouter from "./router/authRouter.js";
import forgetPasswordRouter from "./router/forgetPasswordRouter.js";
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
app.use("/api/v1/forget-password", forgetPasswordRouter);

// Import APIResponse utility
import APIResponse from "./utils/APIResponse.js";
import APIError from "./utils/APIError.js";

// Handle 404s for API routes
app.use("/api", (req, res) => {
  APIResponse.send(
    res,
    APIResponse.error(`Can't find ${req.originalUrl} on this server`, 404)
  );
});

// Handle 404s for other routes (including favicon.ico)
app.all(/(.*)/, (req, res, next) => {
  if (req.accepts("json")) {
    APIResponse.send(
      res,
      APIResponse.error(`Can't find ${req.originalUrl} on this server`, 404)
    );
  } else {
    res.status(404).send(`Can't find ${req.originalUrl} on this server`);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  // Get status code and message
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Something went wrong!" : err.message;

  // Check if error is operational (expected) or programming error
  const isOperational = err.isOperational || false;

  // Log non-operational errors for debugging
  if (!isOperational) {
    console.error("ERROR 💥", err);
  }

  // Send response based on accepted content type
  if (req.accepts("json")) {
    // Use APIResponse for consistent formatting
    APIResponse.send(
      res,
      APIResponse.error(
        message,
        statusCode,
        isOperational ? null : { stack: err.stack }
      )
    );
  } else {
    res.status(statusCode).send(message);
  }
});
