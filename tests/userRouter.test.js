import request from "supertest";
import express from "express";
import userRouter from "../router/userRouter.js";
import authRouter from "../router/authRouter.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);

let token;
let createdUserId;

beforeAll(async () => {
  const adminUser = {
    name: "Admin User",
    email: `admin${Date.now()}@example.com`,
    password: "AdminPass123!",
    role: "ADMIN",
  };

  const res = await request(app).post("/api/v1/auth/register").send(adminUser);
  token = res.body.data.token;
});

describe("userRouter", () => {
  it("should create a new user with default avatar", async () => {
    const userData = {
      name: "John Doe",
      email: `john${Date.now()}@example.com`,
      role: "USER",
      password: "securepassword123",
    };

    const res = await request(app)
      .post("/api/v1/user")
      .set("Authorization", `Bearer ${token}`)
      .send(userData);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.avatar).toBe("avatar.png");
    createdUserId = res.body.data.id;
  });

  it("should create a new user with custom avatar", async () => {
    const userData = {
      name: "Jane Doe",
      email: `jane${Date.now()}@example.com`,
      role: "USER",
      password: "securepassword123",
    };

    const res = await request(app)
      .post("/api/v1/user")
      .set("Authorization", `Bearer ${token}`)
      .field("name", userData.name)
      .field("email", userData.email)
      .field("role", userData.role)
      .field("password", userData.password)
      .attach(
        "avatar",
        path.join(__dirname, "../uploads/userAvatar/avatar.png")
      );

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.avatar).toMatch(/^avatar-.*\.(jpeg|jpg|png)$/);
  });

  it("should get all users with avatar fields", async () => {
    const res = await request(app)
      .get("/api/v1/user")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty("avatar");
  });

  it("should get a user by ID with avatar", async () => {
    const res = await request(app)
      .get(`/api/v1/user/${createdUserId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.id).toBe(createdUserId);
    expect(res.body.data).toHaveProperty("avatar");
  });

  it("should update a user with new avatar", async () => {
    const res = await request(app)
      .put(`/api/v1/user/${createdUserId}`)
      .set("Authorization", `Bearer ${token}`)
      .field("name", "John Updated")
      .field("email", `updated${Date.now()}@example.com`)
      .field("role", "ADMIN")
      .field("password", "newPassword123")
      .attach(
        "avatar",
        path.join(__dirname, "../uploads/userAvatar/avatar.png")
      );

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.name).toBe("John Updated");
    expect(res.body.data.avatar).toMatch(/^avatar-.*\.(jpeg|jpg|png)$/);
  });

  it("should delete a user", async () => {
    const res = await request(app)
      .delete(`/api/v1/user/${createdUserId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.message).toBe("User deleted successfully");
  });
});
