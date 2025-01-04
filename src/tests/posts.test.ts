import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";
import userModel, { IUser } from "../models/users_model";

var app: Express;

type User = IUser & { token?: string };
const testUser: User = {
  email: "test@user.com",
  password: "testpassword",
}

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await postModel.deleteMany();
  await userModel.deleteMany();

  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.token = res.body.token;
  testUser._id = res.body._id;
  expect(testUser.token).toBeDefined();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

let postId = "";

const testPostFail={
  content:"This is my first post 2",
  owner: "Yotam2",
}

describe("Posts Tests", () => {
  test("Posts Get All Test", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Posts Create Test", async () => {
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test Post",
        content: "Test Content",
        owner: "TestOwner",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    postId = response.body._id;
  });

  test("Posts Create Test 2", async () => {
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test Post 2",
        content: "Test Content 2",
        owner: "TestOwner 2",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Test Post 2");
    expect(response.body.content).toBe("Test Content 2");
    postId = response.body._id;
  });

  test("Posts Get By Id Test", async () => {
    const response = await request(app).get("/posts/" + postId);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
  });

  test("Posts Get By Id Test Fail", async () => {
    const response = await request(app).get("/posts/" + postId + "3");
    expect(response.statusCode).toBe(400);
    
  });

  test("Posts Create Test Fail", async () => {
    const response = await request(app).post("/posts").set({ authorization: "JWT " + testUser.token }).send(testPostFail);
    expect(response.statusCode).toBe(400);
  });

  test("Test get post by owner", async () => {
    const response = await request(app).get("/posts?owner=" + testUser._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].title).toBe("Test Post");
    expect(response.body[0].content).toBe("Test Content");
  });

  test("Test Delete Post", async () => {
    const response = await request(app).delete("/posts/" + postId)
      .set({ authorization: "JWT " + testUser.token });
    expect(response.statusCode).toBe(200);
    const response2 = await request(app).get("/posts/" + postId);
    expect(response2.statusCode).toBe(404);
  });

  
});