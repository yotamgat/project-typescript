"use strict";
/*
import request from "supertest"; // to test HTTP requests/responses
import initApp from "../server"; // Link to your server file
import commentsModel from "../models/comments_model";
import mongoose from "mongoose";
import { Express, response } from "express";
//import testComments from "./test_comments.json";
import userModel, { IUser } from "../models/users_model";

let app: Express;

type UserInfo = {
  email: string;
  password: string;
  accessToken?: string;
  _id?: string;
  refreshToken?: string;
};

const testUser: UserInfo = {
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
  if(res.statusCode!==200){
    console.log("Login faild:", res.body);
  }
  
  console.log("Login response:", res.body); // Log the login response
  testUser.accessToken = res.body.accessToken;
  testUser._id= res.body._id;
  expect(testUser.accessToken).toBeDefined();
});

// runs after all tests
afterAll(async() => {
  console.log("after all tests");
  await mongoose.connection.close();
  //done();
});




const invalidComment = {
  comment: "Test Comment 1",
};

const testComments =
  {
    comment: "Test Comment 1",
    postId: new mongoose.Types.ObjectId().toString(), // Ensure valid ObjectId
   
  };

let commentId = "";
let failCommentId="6751b12f555b26da3d29cf74";


describe("Comments Test suite", () => {
  test("Comment test get all", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.body).toHaveLength(0); // 1 comment in the database
  });

  test("Test Adding new comment", async () => {
    const response = await request(app).post("/comments").set({ authorization: "JWT " + testUser.accessToken }).send(testComments)
    console.log("Add new comment response:", response.body); // Log the response body
    expect(response.statusCode).toBe(201); // status code 201
    expect(response.body.comment).toBe(testComments.comment);
    expect(response.body.postId).toBe(testComments.postId);
    commentId = response.body._id
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

  
  test("Test get comment by id", async () => {
    const response = await request(app).get("/comments/" + commentId);
    console.log("response123:", response.body)
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.body.comment).toBe(testComments.comment);
    expect(response.body.postId).toBe(testComments.postId);
    
  });

  test("Test get comment by id fail", async () => {
    const response = await request(app).get("/comments/"+ failCommentId);
    console.log("response1234:", response.body)
    expect(response.statusCode).toBe(404); // status code 404
  });

  

  test("Test update comment by id", async () => {
    const response = await request(app).put("/comments/" + commentId).set({ authorization: "JWT " + testUser.accessToken }).send({ comment: "Updated Comment" });
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.body.comment).toBe("Updated Comment");
  } );

  test("Test get all comments by post id", async () => {
    const response = await request(app).get("/comments?postId=" + testComments.postId);
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.body).toHaveLength(1); // 1 comment in the database
  });


  test("Test delete comment by id", async () => {
    const response = await request(app).delete("/comments/" + commentId).set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200); // status code 200
    expect(response.text).toBe("Comment Deleted");
  } );
 
});

*/
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
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("../server"));
const comments_model_1 = __importDefault(require("../models/comments_model"));
let commentId = "";
let ownerId = "";
let fakeCommentId = "6751b12f555b26da3d29cf74";
let postId = "";
let app;
const testUser = {
    email: "test@user.com",
    password: "testpassword",
    username: "testuser",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    console.log('before all tests');
    yield comments_model_1.default.deleteMany({});
    try {
        // Register a new user
        const res = yield (0, supertest_1.default)(app)
            .post('/auth/register')
            .send({
            email: testUser.email,
            password: testUser.password,
            username: testUser.username
        });
        // Login the user
        const loginRes = yield (0, supertest_1.default)(app)
            .post('/auth/login')
            .send({
            email: testUser.email,
            password: testUser.password
        });
        testUser.accessToken = loginRes.body.accessToken;
        ownerId = loginRes.body._id;
        console.log("Befor All login testUser:", testUser);
        expect(testUser.accessToken).toBeDefined();
    }
    catch (error) {
        console.error("Error during beforeAll setup:", error);
        throw error;
    }
    // Create a new post
    const res = yield (0, supertest_1.default)(app)
        .post('/posts')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
        title: "Post title",
        content: "Post content",
        _id: ownerId,
        userImg: "userImg",
        username: testUser.username
    });
    console.log("Post response:", res.body);
    postId = res.body.post._id;
    ownerId = res.body.post.owner;
}));
// runs after all tests
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('after all tests');
    yield mongoose_1.default.connection.close();
}));
describe('Comments Test Suite', () => {
    test('should create a new comment', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/comments')
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({ comment: 'Test Comment 1', owner: ownerId, postId: postId });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("comment", "Test Comment 1");
        commentId = res.body._id;
    }));
    //Get comment by id
    test('should get a comment by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get(`/comments/${commentId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("comment", "Test Comment 1");
    }));
    //Get all comments
    test('should get all comments', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/comments');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
    }));
    //Update comment by id
    test('should update a comment by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({ comment: 'Updated Comment', owner: ownerId, postId: postId });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("comment", "Updated Comment");
    }));
    //Get all comments by post id
    test('should get all comments by post id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get(`/comments/get-all-comments/${postId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
    }));
    //Delete comment by id
    test('should delete a comment by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${testUser.accessToken}`);
        expect(res.statusCode).toEqual(200);
    }));
});
//# sourceMappingURL=comments.test.js.map