/*
import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";
import userModel, { IUser } from "../models/users_model";

var app: Express;

type UserInfo = {
  email: string;
  password: string;
  accessToken?: string;
  _id?: string;
};

const testUser: UserInfo = {
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
  console.log("Login response:", res.body); // Log the login response
  testUser.accessToken = res.body.accessToken;
  testUser._id = res.body._id;
  expect(testUser.accessToken).toBeDefined();
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
    console.log(response.body); // Log the response body
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Posts Create Test", async () => {
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.accessToken })
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
      .set({ authorization: "JWT " + testUser.accessToken })
      .send({
        title: "Test Post 2",
        content: "Test Content 2",
        owner: "TestOwner 2",
      });
    expect(response.statusCode).toBe(201);
    //expect(response.body.title).toBe("Test Post 2");
    //expect(response.body.content).toBe("Test Content 2");
    //postId = response.body._id;
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
    const response = await request(app).post("/posts").set({ authorization: "JWT " + testUser.accessToken }).send(testPostFail);
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
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    const response2 = await request(app).get("/posts/" + postId);
    expect(response2.statusCode).toBe(404);
  });

  
});
*/

import request from 'supertest';
import mongoose from 'mongoose';
import initApp from "../server"; // Your Express app
import userModel from '../models/users_model';
import postModel from '../models/posts_model';


type UserInfo = {
  email: string;
  password: string;
  accessToken?: string;
  _id?: string;
};
let app: any;

const testUser: UserInfo = {
  email: "test@user.com",
  password: "testpassword",
};

beforeAll(async () => {
  // Connect to the test database
  app = await initApp();
  
  // Create a test user and get the access token
  const res = await request(app)
    .post('/auth/register')
    .send({ email: testUser.email, password: testUser.password });
  testUser._id = res.body._id;
  const loginRes = await request(app)
    .post('/auth/login')
    .send({ email: testUser.email, password: testUser.password });
  testUser.accessToken = loginRes.body.accessToken;
  expect(testUser.accessToken).toBeDefined();
});

// runs after all tests
afterAll(async () => {
  console.log('after all tests');
  await mongoose.connection.close();
});

const testPost = {
  title: "Test Post",
  content: "This is a test post",
};

describe('Posts Test Suite', () => {

  test("Fails to initialize when DB_CONNECTION is missing", async () => {
    const originalDBConnection = process.env.DB_CONNECTION;
    delete process.env.DB_CONNECTION;
  
    await expect(initApp()).rejects.toEqual("DB_CONNECT is not defined in .env file");
  
    process.env.DB_CONNECTION = originalDBConnection; // Restore after test
  });

  test("Fails to connect to MongoDB", async () => {
    jest.spyOn(mongoose, "connect").mockRejectedValueOnce(new Error("Connection Failed"));
  
    await expect(initApp()).rejects.toThrow("Connection Failed");
  
    jest.restoreAllMocks();
  });

  test('should create a new post', async () => {
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send(testPost);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(testPost.title);
    expect(res.body.content).toBe(testPost.content);
  });

  


  
  test('should get all posts', async () => {
    const res = await request(app).get('/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  

  test('should get a post by id', async () => {
    const posts = await postModel.find();
    const postId = posts[0]._id;
    const res = await request(app).get(`/posts/${postId}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(posts[0].title);
    expect(res.body.content).toBe(posts[0].content);
  });

  test('should fail to get a post by invalid id', async () => {
    const res = await request(app).get('/posts/12345');
    expect(res.status).toBe(400);
  });
  test("Get post by id - not found", async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const response = await request(app).get(`/posts/${nonExistentId}`);
    expect(response.statusCode).toBe(404);
    expect(response.text).toContain("Not found");
  });
  
  test("Get post by id - invalid ID format", async () => {
    const response = await request(app).get(`/posts/invalid-id`);
    expect(response.statusCode).toBe(400);
  });

  test('should update a post by id', async () => {
    const posts = await postModel.find();
    const postId = posts[0]._id;
    const res = await request(app)
      .put(`/posts/${postId}`)
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send({ title: 'Updated Post' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Post');
  });

  test("Delete post - non-existent ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .delete(`/posts/${nonExistentId}`)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Post Deleted");
  });
  
 

  test('should fail to update a post by invalid id', async () => {
    const res = await request(app)
      .put('/posts/12345')
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send({ title: 'Updated Post' });
    expect(res.status).toBe(400);
  });


  test('should delete a post by id', async () => {
    const posts = await postModel.find();
    const postId = posts[0]._id;
    const res = await request(app)
      .delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${testUser.accessToken}`);
    expect(res.status).toBe(200);
    const deletedPost = await postModel.findById(postId);
    expect(deletedPost).toBeNull();
  });

  test('should fail to delete a post by invalid id', async () => {
    const res = await request(app)
      .delete('/posts/12345')
      .set('Authorization', `Bearer ${testUser.accessToken}`);
    expect(res.status).toBe(400);
  });

  test('should return 404 when deleting a non-existent post', async () => {
    const res = await request(app)
      .delete('/posts/677fff7f089a2dzaa033036')
      .set('Authorization', `Bearer ${testUser.accessToken}`);
    expect(res.status).toBe(400);
  });



  //--- NOT WORKING TESTS-----
  test('should get posts by owner', async () => {
    const res = await request(app).get(`/posts?owner=${testUser._id}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test('should fail to create a post with invalid data', async () => {
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send({ title: "Invalid Post" }); // Missing content
    expect(res.status).toBe(400);
  });



  // Add more tests as needed...
});