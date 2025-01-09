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
const supertest_1 = __importDefault(require("supertest")); // to test HTTP requests/responses
const server_1 = __importDefault(require("../server")); // Link to your server file
const comments_model_1 = __importDefault(require("../models/comments_model"));
const mongoose_1 = __importDefault(require("mongoose"));
//import testComments from "./test_comments.json";
const users_model_1 = __importDefault(require("../models/users_model"));
let app;
const testUser = {
    email: "test@user.com",
    password: "testpassword",
};
// runs before all tests
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("before all tests");
    app = yield (0, server_1.default)();
    yield comments_model_1.default.deleteMany();
    yield users_model_1.default.deleteMany();
    yield (0, supertest_1.default)(app).post("/auth/register").send(testUser);
    const res = yield (0, supertest_1.default)(app).post("/auth/login").send(testUser);
    console.log("Login response:", res.body); // Log the login response
    testUser.accessToken = res.body.accessToken;
    testUser._id = res.body._id;
    expect(testUser.accessToken).toBeDefined();
}));
// runs after all tests
afterAll((done) => {
    console.log("after all tests");
    mongoose_1.default.connection.close();
    done();
});
const invalidComment = {
    comment: "Test Comment 1",
};
const testComments = {
    comment: "Test Comment 1",
    postId: new mongoose_1.default.Types.ObjectId().toString(), // Ensure valid ObjectId
    owner: new mongoose_1.default.Types.ObjectId().toString(), // Ensure valid ObjectId
};
let commentId = "";
let commentOwner = testComments.owner;
describe("Comments Test suite", () => {
    test("Comment test get all", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.body).toHaveLength(0); // 1 comment in the database
    }));
    test("Test Adding new comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/comments").set({ authorization: "JWT " + testUser.accessToken }).send(testComments);
        console.log("Add new comment response:", response.body); // Log the response body
        expect(response.statusCode).toBe(201); // status code 201
        expect(response.body.comment).toBe(testComments.comment);
        expect(response.body.postId).toBe(testComments.postId);
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
    test("Test get comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.body.comment).toBe(testComments.comment);
        expect(response.body.postId).toBe(testComments.postId);
    }));
    test("Test get comment by id fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/1234");
        expect(response.statusCode).toBe(400); // status code 404
    }));
    test("Test update comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put("/comments/" + commentId).set({ authorization: "JWT " + testUser.accessToken }).send({ comment: "Updated Comment" });
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.body.comment).toBe("Updated Comment");
    }));
    test("Test get all comments by post id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments?postId=" + testComments.postId);
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.body).toHaveLength(1); // 1 comment in the database
    }));
    test("Test delete comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/comments/" + commentId).set({ authorization: "JWT " + testUser.accessToken });
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.text).toBe("Item Deleted");
    }));
});
//# sourceMappingURL=comments.test.js.map