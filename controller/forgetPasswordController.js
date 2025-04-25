import crypto from "crypto";
import asyncHandler from "express-async-handler";
import APIResponse from "../utils/APIResponse.js";
import APIError from "../utils/APIError.js";
import { PrismaClient } from "@prisma/client";
import sendEmail from "../utils/sendMail.js";
import bcrypt from "bcryptjs";

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

  const htmlMessage = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: white;
          padding: 20px;
          border-radius: 0 0 5px 5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .reset-code {
          font-size: 32px;
          font-weight: bold;
          color: #4CAF50;
          text-align: center;
          padding: 20px;
          margin: 20px 0;
          background-color: #f0f0f0;
          border-radius: 5px;
        }
        .note {
          color: #666;
          font-size: 14px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset your password. Here is your password reset code:</p>
          <div class="reset-code">${resetCode}</div>
          <p>Please use this code to reset your password. This code will expire in 10 minutes.</p>
          <p class="note">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // send email
  await sendEmail({
    to: email,
    subject: "Password Reset Code - Valid for 10 minutes",
    message: `Your password reset code is: ${resetCode}. Valid for 10 minutes.`,
    html: htmlMessage,
  });

  APIResponse.send(
    res,
    APIResponse.success(null, 200, "Reset code sent to your email")
  );
});

const verifyResetCode = asyncHandler(async (req, res) => {
  const { email, resetCode } = req.body;

  // Hash the reset code to compare with stored hash
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      email,
      passwordResetCode: hashedResetCode,
      passwordResetExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new APIError("Invalid or expired reset code", 400);
  }

  // Mark the reset code as verified
  await prisma.user.update({
    where: { email },
    data: { passwordResetVerify: true },
  });

  APIResponse.send(
    res,
    APIResponse.success(null, 200, "Reset code verified successfully")
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
      passwordResetVerify: true,
    },
  });

  if (!user) {
    throw new APIError("Reset code not verified or expired", 400);
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password and clear reset fields
  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      passwordResetCode: null,
      passwordResetExpires: null,
      passwordResetVerify: false,
    },
  });

  APIResponse.send(
    res,
    APIResponse.success(null, 200, "Password reset successfully")
  );
});

export { forgetPassword, verifyResetCode, resetPassword };
