import crypto from "crypto";
import asyncHandler from "express-async-handler";
import APIResponse from "../utils/APIResponse.js";
import APIError from "../utils/APIError.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const forgetPassword = asyncHandler(async (req, res) => {
  // get user by email
  const { email } = req.body;
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) throw new APIError("User not found", 404);

  //if user exist generate reset 6 digit code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);
  const hasedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  await prisma.user.update({
    where: { email },
    data: {
      passwordResetCode: hasedResetCode,
      passwordResetExpires: expires,
      passwordResetVerify: false,
    },
  });

  console.log(`Reset code for ${email}: ${resetCode}`);
  console.log(`Reset hased code for ${email}: ${hasedResetCode}`);

  APIResponse.send(
    res,
    APIResponse.success(
      { message: "Password reset code has been sent to your email" },
      200
    )
  );
});

export { forgetPassword };
