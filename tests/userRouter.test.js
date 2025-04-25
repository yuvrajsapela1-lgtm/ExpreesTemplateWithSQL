import request from "supertest";
import express from "express";
import userRouter from "../router/userRouter.js";
import authRouter from "../router/authRouter.js";
import dotenv from "dotenv";
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
  token = res.body.token;
});

describe("userRouter", () => {
  it("should create a new user", async () => {
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

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    createdUserId = res.body.id;
  });

  it("should get all users", async () => {
    const res = await request(app)
      .get("/api/v1/user")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get a user by ID", async () => {
    const res = await request(app)
      .get(`/api/v1/user/${createdUserId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdUserId);
  });

  it("should update a user by ID", async () => {
    const updatedData = {
      name: "John Updated",
      email: `updated${Date.now()}@example.com`,
      role: "ADMIN",
      password: "newPassword123",
    };

    const res = await request(app)
      .put(`/api/v1/user/${createdUserId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(updatedData.name);
  });

  it("should delete a user", async () => {
    const res = await request(app)
      .delete(`/api/v1/user/${createdUserId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("user deleted successfully");
  });
});
