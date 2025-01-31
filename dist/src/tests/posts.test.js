"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
import request from 'supertest';
import mongoose from 'mongoose';
import initApp from "../server"; // Your Express app

import userModel from '../models/users_model';
import postModel from '../models/posts_model';

let id = "";
let fakeId = "6751b12f555b26da3d29cf74";

type UserInfo = {
  email: string;
  password: string;
  username: string;
  accessToken?: string;
  _id?: string;
};
let app: any;

const testUser: UserInfo = {
  email: "test@user.com",
  password: "testpassword",
  username: "testuser",
};

beforeAll(async () => {
  // Connect to the test database
  //erase the database before running tests
  
  app = await initApp();
  console.log('before all tests');
  
  await userModel.deleteMany({});
  try{
      // Register a new user
      const res = await request(app)
      .post('/auth/register')
      .send({
        email: testUser.email,
        password: testUser.password,
        username:testUser.username
      });
      testUser._id = res.body.user._id;

      // Login the user
      const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    testUser.accessToken = loginRes.body.accessToken;
    console.log("Befor All login testUser:", testUser);
    expect(testUser.accessToken).toBeDefined();
  }catch(error){
    console.error("Error during beforeAll setup:", error);
    throw error;
  }
  
  
});

// runs after all tests
afterAll(async () => {
  console.log('after all tests');
  await mongoose.connection.close();
});

const testPost = {
  title: "Test Post title",
  content: "This is a test post content",
  owner: testUser._id,
  userImg: "testUserImg.jpg",
  username: "testUsername",
  photo: "testPhoto.jpg"
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
  //Test create post
  test("Create a post", async () => {
    console.log("testUser aaaa:", testUser);
    testPost.owner = testUser._id;
    console.log("testPost after:", testPost);
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send({
        title: testPost.title,
        content: testPost.content,
        _id: testPost.owner,
        userImg: testPost.userImg,
        username: testPost.username,
        photo: testPost.photo
      });
    id= res.body.post._id;
    console.log("Create post res:", res.body);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Post created successfully");
    expect(res.body.post.title).toBe(testPost.title);
    expect(res.body.post.content).toBe(testPost.content);
    expect(res.body.post.userImg).toBe(testPost.userImg);
    expect(res.body.post.username).toBe(testPost.username);
    expect(res.body.post.photo).toBe(testPost.photo);
  });

  //Test get all posts
  test("Get all posts", async () => {
    const res = await request(app).get('/posts')
      
    expect(res.status).toBe(200);
  });


  //Test get post by id
  test("Get post by id", async () => {
    console.log("testPost._id:", id);
    const res = await request(app).get(`/posts/${id}`);
    console.log("Get post by id res:", res.body);
    expect(res.status).toBe(200);
  });

  //Test like post
  test("Like post", async () => {
    const res = await request(app)
      .put(`/posts/like/${id}`)
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send({
        userId: testUser._id
      });
    console.log("Like post res:", res.body);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Post liked");
  });

  //Unlike post
  test("Unlike post", async () => {
    const res = await request(app)
      .put(`/posts/like/${id}`)
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send({
        userId: testUser._id
      });
    console.log("Unlike post res:", res.body);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Post unliked");
  });
   //Get post by owner failure
   test("Get post by owner failure", async () => {
    const res = await request(app)
      .get(`/posts/get-all-posts/${fakeId}`)
      .set('Authorization', `Bearer ${testUser.accessToken}`)
    console.log("Get post by owner failure res:", res.body);
    expect(res.status).toBe(200);
  });
   //update post test
   test("Edit post", async () => {
    const res = await request(app)
      .put(`/posts/${id}`)
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send({ title: "Updated title", content: "Updated content", owner: testUser._id });
    console.log("Edit post res:", res.body);
    expect(res.status).toBe(201);
    
  });
  //update post failure - not the owner
  test("Edit post failure", async () => {
    const res = await request(app)
      .put(`/posts/${id}`)
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send({ title: "Updated title", content: "Updated content", owner: fakeId });
    console.log("Edit post failure res:", res.body);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("you are not the owner of this post");
  });
  //Edit post test
  test("Edit post", async () => {
    const res = await request(app)
      .put(`/posts/edit/${id}`)
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send({ title: "Updated title", content: "Updated content", owner: testUser._id });
    console.log("Edit post res:", res.body);
    expect(res.status).toBe(201);
    
  });
 
  //Delete post by id
  test("Delete post by id", async () => {
    const res = await request(app)
      .delete(`/posts/${id}`)
      .set('Authorization', `Bearer ${testUser.accessToken}`)
    console.log("Delete post by id res:", res.body);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("post deleted");
  });
 
  //Create post failure
  test("Create post failure", async () => {
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send({});
    console.log("Create post failure res:", res.body);
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Failed to create post");
  });

  //Get post by id failure
  test("Get post by id failure", async () => {
    const res = await request(app).get(`/posts/${fakeId}`);
    console.log("Get post by id failure res:", res.body);
    expect(res.status).toBe(404);
  });

  //Update post by id failure- not the owner
  test("Update post by id failure", async () => {
    const res = await request(app)
      .put(`/posts/${fakeId}`)
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send({ title: "Updated title", content: "Updated content", owner: fakeId });
    console.log("Update post by id failure res:", res.body);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("you are not the owner of this post");
  });

 

  //Like post failure- post not found
  test("Like post failure", async () => {
    const res = await request(app)
      .put(`/posts/like/${fakeId}`)
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send({});
    console.log("Like post failure res:", res.body);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Post not liked");
  });

  //Delete post by id failure- post not found
  test("Delete post by id failure", async () => {
    const res = await request(app)
      .delete(`/posts/${fakeId}`)
      .set('Authorization', `Bearer ${testUser.accessToken}`)
    console.log("Delete post by id failure res:", res.body);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("post not deleted");
  });
});
*/
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("../server")); // Your Express app
const users_model_1 = __importDefault(require("../models/users_model"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
let app;
let testUser = {};
let testPost = {};
const fakeId = "6751b12f555b26da3d29cf74";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Initialize the app
    app = yield (0, server_1.default)();
    // Ensure TOKEN_SECRET is set
    if (!process.env.TOKEN_SECRET) {
        process.env.TOKEN_SECRET = 'your-secret-key';
    }
}), 30000); // Set timeout to 30 seconds
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // Clean up the database before each test
    yield users_model_1.default.deleteMany({});
    yield posts_model_1.default.deleteMany({});
    // Register a test user
    const registerRes = yield (0, supertest_1.default)(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'password', username: 'testuser' });
    testUser = registerRes.body.user;
    // Login the test user
    const loginRes = yield (0, supertest_1.default)(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password' });
    testUser.accessToken = loginRes.body.accessToken;
    // Create a test post
    testPost = yield posts_model_1.default.create({
        title: 'Test Post',
        content: 'This is a test post',
        owner: testUser._id,
        userImg: 'testUserImg.jpg',
        username: 'testUsername',
        photo: 'testPhoto.jpg'
    });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('Posts Test Suite', () => {
    test('should create a new post', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/posts')
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({
            title: 'New Post',
            content: 'This is a new post',
            _id: testUser._id,
            userImg: 'newUserImg.jpg',
            username: 'newUsername',
            photo: 'newPhoto.jpg'
        });
        expect(res.status).toBe(201);
        expect(res.body.post.title).toBe('New Post');
        expect(res.body.post.content).toBe('This is a new post');
    }));
    test('should get all posts', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/posts');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    }));
    test('should get a post by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get(`/posts/${testPost._id}`);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe(testPost.title);
    }));
    test('should return 404 if post not found by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get(`/posts/${fakeId}`);
        expect(res.status).toBe(404);
    }));
    test('should delete a post by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete(`/posts/${testPost._id}`)
            .set('Authorization', `Bearer ${testUser.accessToken}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('post deleted');
    }));
    test('should return 400 if post not found for deletion', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete(`/posts/${fakeId}`)
            .set('Authorization', `Bearer ${testUser.accessToken}`);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('post not deleted');
    }));
    test('should update a post by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put(`/posts/${testPost._id}`)
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({
            title: 'Updated Post Title',
            content: 'Updated Post Content',
            owner: testUser._id,
            photo: 'updatedPhoto.jpg'
        });
        expect(res.status).toBe(201);
        expect(res.body.title).toBe('Updated Post Title');
        expect(res.body.content).toBe('Updated Post Content');
    }));
    test('should return 400 if user is not the owner of the post for update', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put(`/posts/${testPost._id}`)
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({
            title: 'Updated Post Title',
            content: 'Updated Post Content',
            owner: fakeId,
            photo: 'updatedPhoto.jpg'
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('you are not the owner of this post');
    }));
    test('should return 400 if no file is uploaded', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/posts/upload')
            .set('Authorization', `Bearer ${testUser.accessToken}`);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('file not found');
    }));
    test('should edit post successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put(`/posts/edit/${testPost._id}`)
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({
            title: 'Edited Post Title',
            content: 'Edited Post Content',
            _id: testUser._id,
            photo: 'editedPhoto.jpg'
        });
        expect(res.status).toBe(201);
        expect(res.body.title).toBe('Edited Post Title');
        expect(res.body.content).toBe('Edited Post Content');
    }));
    test('should return 400 if user is not the owner of the post for edit', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put(`/posts/edit/${testPost._id}`)
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({
            title: 'Edited Post Title',
            content: 'Edited Post Content',
            _id: fakeId,
            photo: 'editedPhoto.jpg'
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('you are not the owner of this post');
    }));
    test('should like a post', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put(`/posts/like/${testPost._id}`)
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({ userId: testUser._id });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Post liked');
    }));
    test('should unlike a post', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .put(`/posts/like/${testPost._id}`)
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({ userId: testUser._id });
        const res = yield (0, supertest_1.default)(app)
            .put(`/posts/like/${testPost._id}`)
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({ userId: testUser._id });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Post unliked');
    }));
    test('should return 400 if post not found for like', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put(`/posts/like/${fakeId}`)
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({ userId: testUser._id });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Post not liked');
    }));
});
//# sourceMappingURL=posts.test.js.map