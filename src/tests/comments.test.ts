
import request from "supertest"; // to test HTTP requests/responses
import initApp from "../server"; // Link to your server file
import commentsModel from "../models/comments_model";
import mongoose from "mongoose";
import { Express } from "express";
import testComments from "./test_comments.json";
import userModel, { IUser } from "../models/users_model";

let app: Express;

type User = IUser & { accessToken?: string };
const testUser: User = {
  email: "test@user.com",
  password: "testpassword",
}

// runs before all tests
beforeAll(async () => {
  console.log("before all tests");
  app = await initApp();
  await commentsModel.deleteMany();
  await userModel.deleteMany();
  await request(app).post("/auth/register").send(testUser);
    const res = await request(app).post("/auth/login").send(testUser);
    console.log("Login response:", res.body); // Log the login response
    testUser.accessToken = res.body.accessToken;
    testUser._id = res.body._id;
    expect(testUser.accessToken).toBeDefined();
});

// runs after all tests
afterAll((done) => {
  console.log("after all tests");
  mongoose.connection.close();
  done();
});

let commentId = "";


const invalidComment = {
  comment: "Test Comment 1",
};

describe("Comments Test suite", () => {
  test("Comment test get all", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.body).toHaveLength(0); // 1 comment in the database
  });

  test("Test Adding new comment", async () => {
    const response = await request(app).post("/comments").set({ authorization: "JWT " + testUser.accessToken }).send(testComments[0])
    expect(response.statusCode).toBe(201); // status code 201
    expect(response.body.comment).toBe(testComments[0].comment);
    expect(response.body.postId).toBe(testComments[0].postId);
    expect(response.body.owner).toBe(testComments[0].owner);
    commentId = response.body._id;
  });

  test("Test Adding invalid comment", async () => {
    const response = await request(app).post("/comments").send(invalidComment);
    expect(response.statusCode).not.toBe(201); // status code 400
  });

  test("Test get all comments after adding", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.body).toHaveLength(1); // 1 comment in the database
  });

  test("Test get comment by owner", async () => {
    const response = await request(app).get(
      "/comments?owner=" + testComments[0].owner
    );
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.body).toHaveLength(1); // 1 comment in the database
    expect(response.body[0].comment).toBe(testComments[0].comment);
    expect(response.body[0].postId).toBe(testComments[0].postId);
    expect(response.body[0].owner).toBe(testComments[0].owner);
  });

  test("Test get comment by id", async () => {
    const response = await request(app).get("/comments/" + commentId);
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.body.comment).toBe(testComments[0].comment);
    expect(response.body.postId).toBe(testComments[0].postId);
    expect(response.body.owner).toBe(testComments[0].owner);
  });

  test("Test get comment by id fail", async () => {
    const response = await request(app).get("/comments/1234");
    expect(response.statusCode).toBe(400); // status code 404
  });

  test("Test delete comment by id", async () => {
    const response = await request(app).delete("/comments/" + commentId).set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.text).toBe("Item Deleted");
  } );
});
