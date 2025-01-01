"use strict";
/*import request from "supertest"; // to test HTTP requests/responses
import appInit from "../server"; // Link to your server file
import mongoose from "mongoose";
//import postModel from "../models/posts_model";
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
  //await postModel.deleteMany();
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
const supertest_1 = __importDefault(require("supertest")); // to test HTTP requests/responses
const server_1 = __importDefault(require("../server")); // Link to your server file
const comments_model_1 = __importDefault(require("../models/comments_model"));
const mongoose_1 = __importDefault(require("mongoose"));
let app;
// runs before all tests
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    console.log("before all tests");
    yield comments_model_1.default.deleteMany();
}));
// runs after all tests
afterAll(() => {
    console.log("after all tests");
    mongoose_1.default.connection.close();
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
    test("Comment test get all", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.body).toHaveLength(0); // 1 comment in the database
    }));
    test("Test Adding new comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/comments").send(testComment);
        expect(response.statusCode).toBe(201); // status code 201
        expect(response.body.comment).toBe(testComment.comment);
        expect(response.body.postId).toBe(testComment.postId);
        expect(response.body.owner).toBe(testComment.owner);
        commentId = response.body._id;
    }));
    test("Test Adding invalid comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/comments").send(invalidComment);
        expect(response.statusCode).not.toBe(201); // status code 400
    }));
    test("Test get all comments after adding", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.body).toHaveLength(1); // 1 comment in the database
    }));
    test("Test get comment by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments?owner=" + testComment.owner);
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.body).toHaveLength(1); // 1 comment in the database
        expect(response.body[0].owner).toBe(testComment.owner);
    }));
    test("Test get comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.body._id).toBe(commentId); // post id
    }));
    test("Test get comment by id fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/1234");
        expect(response.statusCode).toBe(400); // status code 404
    }));
});
//# sourceMappingURL=comments.test.js.map