import express from "express";
import {
  forgetPassword,
  verifyResetCode,
  resetPassword,
} from "../controller/forgetPasswordController.js";

const router = express.Router();

router.post("/", forgetPassword);
router.post("/verify-code", verifyResetCode);
router.post("/reset-password", resetPassword);

export default router;
