import request from "supertest"; // to test HTTP requests/responses
import initApp from "../server"; // Link to your server file
import mongoose from "mongoose";
import { Express } from "express";
import userModel, {IUser} from "../models/users_model";
import postModel from "../models/posts_model";

let app: Express;

// runs before all tests
beforeAll(async () => {
  app = await initApp();
  console.log("before all tests");
  await userModel.deleteMany({}); // delete all users
  await postModel.deleteMany({}); // delete all posts
});

// runs after all tests
afterAll(() => {
  console.log("after all tests");
  mongoose.connection.close();
});

const baseUrl = "/auth";
type User = IUser & { token?: string }; // User type with token

const testUser: User = {
  email: "test@user.com",
  password: "testpassword",
};
//describe creates a block that groups together several related tests
describe("Auth Test", () => {
  test("Auth test register", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).toBe(200);
  });
  test("Auth test register fail", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).not.toBe(200);
  });
  test("Auth test register fail", async () => {
    const response = await request(app).post(baseUrl + "/register").send({
      email: "asdsadasd",
    });
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app).post(baseUrl + "/register").send({
      email: "",
      password: "sfsd",
    });
    expect(response2.statusCode).not.toBe(200)
  });

  test("Auth test login", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    const token = response.body.token;
    expect(token).toBeDefined();
    expect(response.body._id).toBeDefined();
    testUser.token = token;
    testUser._id = response.body._id;
  });

  test("Auth test login fail", async () => {
    const response = await request(app).post(baseUrl + "/login").send({
      email: testUser.email,
      password: "sddfsdf",
    });
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app).post(baseUrl + "/login").send({
      email: "asdasd",
      password: "sddfsdf",
    });
    expect(response2.statusCode).not.toBe(200);

    
  });

  test("Auth test me", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post",
      content: "Test Content",
      owner: "sdfSd",
    });
    expect(response.statusCode).not.toBe(201);
    const response2 = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test Post",
        content: "Test Content",
        owner: "sdfSd",
      });
    expect(response2.statusCode).toBe(201);
  });
});
