import request from "supertest";
import express from "express";
import userRouter from "../router/userRouter.js";

const app = express();
app.use(express.json());
app.use("/api/v1/user", userRouter);

describe("userRouter", () => {
  let createdUserId;
  it("should create new user", async () => {
    const userData = {
      name: "John Doe",
      email: "john" + Date.now() + "@example.com",
      role: "USER",
      password: "securepassword123",
    };
    const res = await request(app).post("/api/v1/user").send(userData);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe(userData.name);
    expect(res.body.email).toBe(userData.email);
    createdUserId = res.body.id;
  });

  it("should get all users", async () => {
    const res = await request(app).get("/api/v1/user");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    console.log("==========================================");
    console.log(res.body);
  });
});
