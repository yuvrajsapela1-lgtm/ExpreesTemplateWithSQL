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
  });

  it("should get a user by ID", async () => {
    const res = await request(app).get(`/api/v1/user/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdUserId);
  });

  it("should update a user by ID", async () => {
    const updatedData = {
      name: "John Updated",
      email: "johnupdated" + Date.now() + "@example.com",
      role: "ADMIN",
      password: "updatedpassword123",
    };
    const res = await request(app)
      .put(`/api/v1/user/${createdUserId}`)
      .send(updatedData);
    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.email).toBe(updatedData.email);
  });

  it("should delete a user", async () => {
    const res = await request(app).delete(`/api/v1/user/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("user deleted successfully");
  });
});
