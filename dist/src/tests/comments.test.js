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
const test_comments_json_1 = __importDefault(require("./test_comments.json"));
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
let commentId = "";
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
        const response = yield (0, supertest_1.default)(app).post("/comments").set({ authorization: "JWT " + testUser.accessToken }).send(test_comments_json_1.default[0]);
        expect(response.statusCode).toBe(201); // status code 201
        expect(response.body.comment).toBe(test_comments_json_1.default[0].comment);
        expect(response.body.postId).toBe(test_comments_json_1.default[0].postId);
        expect(response.body.owner).toBe(test_comments_json_1.default[0].owner);
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
        const response = yield (0, supertest_1.default)(app).get("/comments?owner=" + test_comments_json_1.default[0].owner);
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.body).toHaveLength(1); // 1 comment in the database
        expect(response.body[0].comment).toBe(test_comments_json_1.default[0].comment);
        expect(response.body[0].postId).toBe(test_comments_json_1.default[0].postId);
        expect(response.body[0].owner).toBe(test_comments_json_1.default[0].owner);
    }));
    test("Test get comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.body.comment).toBe(test_comments_json_1.default[0].comment);
        expect(response.body.postId).toBe(test_comments_json_1.default[0].postId);
        expect(response.body.owner).toBe(test_comments_json_1.default[0].owner);
    }));
    test("Test get comment by id fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/1234");
        expect(response.statusCode).toBe(400); // status code 404
    }));
    test("Test delete comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/comments/" + commentId).set({ authorization: "JWT " + testUser.accessToken });
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.text).toBe("Item Deleted");
    }));
});
//# sourceMappingURL=comments.test.js.map