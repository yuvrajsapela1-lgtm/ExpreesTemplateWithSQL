import express from "express";
import { forgetPassword } from "../controller/forgetPasswordController.js";

const router = express.Router();

router.post("/", forgetPassword);

export default router;
