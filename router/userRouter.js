import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  imageUpload,
} from "../controller/userController.js";
import { protect, authorizeRoles } from "../Middleware/authMiddleware.js";
const router = express.Router();

// Protected routes (require authentication)
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);

// Admin-only routes
router.post("/", protect, imageUpload, authorizeRoles("ADMIN"), createUser);
router.put("/:id", protect, imageUpload, authorizeRoles("ADMIN"), updateUser);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteUser);

export default router;
