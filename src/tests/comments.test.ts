
import request from "supertest"; // to test HTTP requests/responses
import initApp from "../server"; // Link to your server file
import commentsModel from "../models/comments_model";
import mongoose from "mongoose";
import { Express } from "express";

let app: Express;

// runs before all tests
beforeAll(async () => {
  app = await initApp();
  console.log("before all tests");
  await commentsModel.deleteMany();
});

// runs after all tests
afterAll(() => {
  console.log("after all tests");
  mongoose.connection.close();
});

let commentId = "";
const testComment = {
  comment: "Test Comment 1",
  postId: "32453254gffd4235f25345g",
  owner: "Yotam",
};

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
    const response = await request(app).post("/comments").send(testComment);
    expect(response.statusCode).toBe(201); // status code 201
    expect(response.body.comment).toBe(testComment.comment);
    expect(response.body.postId).toBe(testComment.postId);
    expect(response.body.owner).toBe(testComment.owner);
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
      "/comments?owner=" + testComment.owner
    );
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.body).toHaveLength(1); // 1 comment in the database
    expect(response.body[0].owner).toBe(testComment.owner);
  });

  test("Test get comment by id", async () => {
    const response = await request(app).get("/comments/" + commentId);
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.body._id).toBe(commentId); // post id
  });

  test("Test get comment by id fail", async () => {
    const response = await request(app).get("/comments/1234");
    expect(response.statusCode).toBe(400); // status code 404
  });
});
