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
const mongoose_1 = __importDefault(require("mongoose"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
// test data for the post
const test_posts_json_1 = __importDefault(require("./test_posts.json")); // test data for the post
const posts = test_posts_json_1.default;
let app;
// runs before all tests
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    console.log("before all tests");
    yield posts_model_1.default.deleteMany();
}));
// runs after all tests
afterAll(() => {
    console.log("after all tests");
    mongoose_1.default.connection.close();
});
//describe creates a block that groups together several related tests
describe("Posts Test", () => {
    test("Test get all post empty", () => __awaiter(void 0, void 0, void 0, function* () {
        //example for test
        const response = yield (0, supertest_1.default)(app).get("/posts");
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.body.length).toBe(0); // no posts in the database
    }));
    test("Test create new post", () => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < test_posts_json_1.default.length; i++) {
            const response = yield (0, supertest_1.default)(app).post("/posts").send(test_posts_json_1.default[i]);
            expect(response.statusCode).toBe(201); // status code 201
            expect(response.body.title).toBe(test_posts_json_1.default[i].title);
            expect(response.body.content).toBe(test_posts_json_1.default[i].content);
            expect(response.body.owner).toBe(test_posts_json_1.default[i].owner);
            posts[i]._id = response.body._id; // save the post id for later use
        }
    }));
    test("Test get all post full", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.body.length).toBe(test_posts_json_1.default.length); // XX posts in the database
    }));
    test("Test get post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + posts[0]._id);
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.body._id).toBe(posts[0]._id); // post id
    }));
    test("Test filter post by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts?owner=" + test_posts_json_1.default[0].owner);
        expect(response.statusCode).toBe(200); // status code 200
        expect(response.body.length).toBe(1); // 1 post in the database
    }));
    test("Test delete post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/posts/" + posts[0]._id);
        expect(response.statusCode).toBe(200); // status code 200
        const responseGet = yield (0, supertest_1.default)(app).get("/posts" + posts[0]._id); // get the deleted post
        expect(responseGet.statusCode).toBe(404); // status code 400
    }));
    test("Test create new post fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send({
            title: "Test Post 1",
            content: "Test Content 1",
        });
        expect(response.statusCode).toBe(400); //  status code 400
    }));
});
//# sourceMappingURL=posts.test.js.map