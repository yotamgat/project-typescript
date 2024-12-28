import request from "supertest"; // to test HTTP requests/responses
import appInit from "../server"; // Link to your server file
import mongoose from "mongoose";
import postModel from "../models/posts_model";
//const { getPostById } = require('../controllers/posts_controller');
import { Express } from "express";

// test data for the post
import testPost from "./test_posts.json"; // test data for the post
type Post = {
  title: string;
  content: string;
  owner: string;
  _id?: string;
};

const posts: Post[] = testPost;

let app: Express;

// runs before all tests
beforeAll(async () => {
  app = await appInit();
  console.log("before all tests");
  await postModel.deleteMany();
});

// runs after all tests
afterAll(() => {
  console.log("after all tests");
  mongoose.connection.close();
});

//describe creates a block that groups together several related tests
describe("Posts Test", () => {
  test("Test get all post empty", async () => {
    //example for test
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.body.length).toBe(0); // no posts in the database
  });

  test("Test create new post", async () => {
    for (let i = 0; i < testPost.length; i++) {
      const response = await request(app).post("/posts").send(testPost[i]);
      expect(response.statusCode).toBe(201); // status code 201
      expect(response.body.title).toBe(testPost[i].title);
      expect(response.body.content).toBe(testPost[i].content);
      expect(response.body.owner).toBe(testPost[i].owner);
      posts[i]._id = response.body._id; // save the post id for later use
    }
  });

  test("Test get all post full", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.body.length).toBe(testPost.length); // XX posts in the database
  });

  test("Test get post by id", async () => {
    const response = await request(app).get("/posts/" + posts[0]._id);
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.body._id).toBe(posts[0]._id); // post id
  });

  test("Test filter post by owner", async () => {
    const response = await request(app).get(
      "/posts?owner=" + testPost[0].owner
    );
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.body.length).toBe(1); // 1 post in the database
  });

  test("Test delete post", async () => {
    const response = await request(app).delete("/posts/" + posts[0]._id);
    expect(response.statusCode).toBe(200); // status code 200

    const responseGet = await request(app).get("/posts" + posts[0]._id); // get the deleted post
    expect(responseGet.statusCode).toBe(404); // status code 400
  });

  test("Test create new post fail", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post 1",
      content: "Test Content 1",
    });
    expect(response.statusCode).toBe(400); //  status code 400
  });
});
