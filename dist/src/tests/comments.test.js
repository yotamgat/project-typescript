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