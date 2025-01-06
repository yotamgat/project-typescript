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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
const users_model_1 = __importDefault(require("../models/users_model"));
var app;
const testUser = {
    email: "test@user.com",
    password: "testpassword",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("beforeAll");
    app = yield (0, server_1.default)();
    yield posts_model_1.default.deleteMany();
    yield users_model_1.default.deleteMany();
    yield (0, supertest_1.default)(app).post("/auth/register").send(testUser);
    const res = yield (0, supertest_1.default)(app).post("/auth/login").send(testUser);
    console.log("Login response:", res.body); // Log the login response
    testUser.accessToken = res.body.accessToken;
    testUser._id = res.body._id;
    expect(testUser.accessToken).toBeDefined();
}));
afterAll((done) => {
    console.log("afterAll");
    mongoose_1.default.connection.close();
    done();
});
let postId = "";
const testPostFail = {
    content: "This is my first post 2",
    owner: "Yotam2",
};
describe("Posts Tests", () => {
    test("Posts Get All Test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        console.log(response.body); // Log the response body
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    }));
    test("Posts Create Test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts")
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
    }));
    test("Posts Create Test 2", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts")
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
    }));
    test("Posts Get By Id Test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe("Test Post");
        expect(response.body.content).toBe("Test Content");
    }));
    test("Posts Get By Id Test Fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + postId + "3");
        expect(response.statusCode).toBe(400);
    }));
    test("Posts Create Test Fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").set({ authorization: "JWT " + testUser.accessToken }).send(testPostFail);
        expect(response.statusCode).toBe(400);
    }));
    test("Test get post by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts?owner=" + testUser._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].title).toBe("Test Post");
        expect(response.body[0].content).toBe("Test Content");
    }));
    test("Test Delete Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/posts/" + postId)
            .set({ authorization: "JWT " + testUser.accessToken });
        expect(response.statusCode).toBe(200);
        const response2 = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        expect(response2.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=posts.test.js.map