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
const users_model_1 = __importDefault(require("../models/users_model"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let app;
// runs before all tests
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    console.log("before all tests");
    yield users_model_1.default.deleteMany({}); // delete all users
    yield posts_model_1.default.deleteMany({}); // delete all posts
}));
// runs after all tests
afterAll(() => {
    console.log("after all tests");
    mongoose_1.default.connection.close();
});
const baseUrl = "/auth";
const testUser = {
    email: "test@user.com",
    password: "testpassword",
};
const invalidTestUser = {
    email: "invalidTest@user.com",
    password: "1234",
};
//describe creates a block that groups together several related tests
describe("Auth Test", () => {
    test("Auth Register", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/register").send(testUser);
        expect(response.statusCode).toBe(200);
    }));
    test("Auth Registeration Fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/register").send(testUser);
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth test login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/login").send(testUser);
        expect(response.statusCode).toBe(200);
        const accessToken = response.body.accessToken;
        const refreshToken = response.body.refreshToken;
        const userId = response.body._id;
        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
        expect(userId).toBeDefined();
        testUser.accessToken = accessToken;
        testUser.refreshToken = refreshToken;
        testUser._id = userId;
    }));
    test("Login fails when TOKEN_SECRET is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(testUser);
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain("Missing auth configuration");
        process.env.TOKEN_SECRET = originalSecret;
    }));
    test("Refresh fails when user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidToken = jsonwebtoken_1.default.sign({ _id: "invalidUserId" }, process.env.TOKEN_SECRET);
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: invalidToken,
        });
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain("Invalid Token");
    }));
    test("Refresh fails when TOKEN_SECRET is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: testUser.refreshToken,
        });
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain("Missing auth configuration");
        process.env.TOKEN_SECRET = originalSecret;
    }));
    test("Refresh fails when refresh token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: "invalid  token", // invalid token  
        });
        expect(response.statusCode).toBe(403);
        expect(response.text).toContain("Invalid Refresh Token");
    }));
    test("Refresh fails when refresh token is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").send({});
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain("Invalid Token");
    }));
    test("Make sure two access tokens are not the same", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/login").send({
            email: testUser.email,
            password: testUser.password,
        });
        expect(response.body.accessToken).not.toEqual(testUser.accessToken);
    }));
    test("Get Protected API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send({
            title: "Test Post",
            content: "Test Content",
            owner: "sdfSd",
        });
        expect(response.statusCode).not.toBe(201);
        const response2 = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set({ authorization: "JWT " + testUser.accessToken })
            .send({
            title: "Test Post",
            content: "Test Content",
            owner: "sdfSd",
        });
        expect(response2.statusCode).toBe(201);
    }));
    test("Get Protected API Invalid Token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send({
            title: "Test Post",
            content: "Test Content",
            owner: "sdfSd",
        });
        expect(response.statusCode).not.toBe(201);
        const response2 = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set({ authorization: "JWT " + testUser.accessToken + '1' })
            .send({
            title: testUser._id,
            content: "Test Content",
            owner: "sdfSd",
        });
        expect(response2.statusCode).not.toBe(201);
    }));
    test("Refresh Token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/refresh").send({
            refreshToken: testUser.refreshToken,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        testUser.accessToken = response.body.accessToken;
        testUser.refreshToken = response.body.refreshToken;
    }));
    test("Logout - Invalidate Refresh Token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/logout").send({
            refreshToken: testUser.refreshToken,
        });
        expect(response.statusCode).toBe(200);
        const response2 = yield (0, supertest_1.default)(app).post(baseUrl + "/refresh").send({
            refreshToken: testUser.refreshToken,
        });
        expect(response2.statusCode).not.toBe(200);
    }));
    test("Refresh Toekn Multiple Usage", () => __awaiter(void 0, void 0, void 0, function* () {
        // login- get a refresh token
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/login").send({
            email: testUser.email,
            password: testUser.password,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        testUser.accessToken = response.body.accessToken;
        testUser.refreshToken = response.body.refreshToken;
        //first time use the refresh token and get a new refresh token
        const response2 = yield (0, supertest_1.default)(app).post(baseUrl + "/refresh").send({
            refreshToken: testUser.refreshToken,
        });
        expect(response2.statusCode).toBe(200);
        const newRefreshToken = response2.body.refreshToken;
        //second time use the old refresh token and expect to fail
        const response3 = yield (0, supertest_1.default)(app).post(baseUrl + "/refresh").send({
            refreshToken: testUser.refreshToken,
        });
        expect(response3.statusCode).not.toBe(200);
        //try to use the new refresh token and expect to fail
        const response4 = yield (0, supertest_1.default)(app).post(baseUrl + "/refresh").send({
            refreshToken: newRefreshToken,
        });
        expect(response4.statusCode).not.toBe(200);
    }));
    jest.setTimeout(10000);
    test("Timout on access token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/login").send({
            email: testUser.email,
            password: testUser.password,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        testUser.accessToken = response.body.accessToken;
        testUser.refreshToken = response.body.refreshToken;
        //wait for 6 seconds
        yield new Promise((resolve) => setTimeout(resolve, 6000));
        //try to access with expired token
        const response2 = yield (0, supertest_1.default)(app).post("/posts").set({ authorization: "JWT " + testUser.accessToken }).send({
            title: "Test Post",
            content: "Test Content",
            owner: "sdfSd",
        });
        expect(response2.statusCode).not.toBe(201);
        const response3 = yield (0, supertest_1.default)(app).post(baseUrl + "/refresh").send({
            refreshToken: testUser.refreshToken,
        });
        expect(response3.statusCode).toBe(200);
        testUser.accessToken = response3.body.accessToken;
        testUser.refreshToken = response3.body.refreshToken;
        const response4 = yield (0, supertest_1.default)(app).post("/posts").set({ authorization: "JWT " + testUser.accessToken }).send({
            title: "Test Post",
            content: "Test Content",
            owner: "sdfSd",
        });
        expect(response4.statusCode).toBe(201);
    }));
    //---------New Login Tests--------------
    test("Login with missing email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({ password: "testpassword" });
        expect(response.statusCode).toBe(400);
    }));
    test('should not get posts without token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/posts');
        expect(res.statusCode).toEqual(401);
        expect(res.text).toContain('Missing Token');
    }));
    test("Login with missing password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({ email: "test@user.com" });
        expect(response.statusCode).toBe(400);
    }));
    test("Login with invalid email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({ email: "invalid@user.com", password: "testpassword" });
        expect(response.statusCode).toBe(400);
    }));
    test("Login with invalid password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({ email: "test@user.com", password: "invalidpassword" });
        expect(response.statusCode).toBe(400);
    }));
    test("Login with valid email and password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(testUser);
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        testUser.accessToken = response.body.accessToken;
        testUser.refreshToken = response.body.refreshToken;
    }));
    //---------New Logout Tests--------------
    test("Logout with missing refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/logout").send({});
        expect(response.statusCode).toBe(400);
    }));
    test("Logout with invalid refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/logout").send({ refreshToken: "invalidtoken" });
        expect(response.statusCode).toBe(403);
    }));
    test("Logout with valid refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/logout").send({ refreshToken: testUser.refreshToken });
        expect(response.statusCode).toBe(200);
    }));
    //---------New Register Tests--------------
    test("Register with missing email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send({ password: "testpassword" });
        expect(response.statusCode).toBe(400);
    }));
    test("Register with missing password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send({ email: "test@user.com" });
        expect(response.statusCode).toBe(400);
    }));
    test("Register with missing email and password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send({});
        expect(response.statusCode).toBe(400);
    }));
    test("Register with valid email and password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(testUser);
        expect(response.statusCode).not.toBe(200);
    }));
    //---------New Refresh Tokens Tests--------------
    test("Refresh with missing refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").send({});
        expect(response.statusCode).toBe(400);
    }));
    test("Refresh with invalid refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").send({ refreshToken: "invalidtoken" });
        expect(response.statusCode).toBe(403);
    }));
    test("Refresh with valid refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(app).post("/auth/login").send(testUser);
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").send({ refreshToken: loginResponse.body.refreshToken });
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
    }));
    test("Login with missing TOKEN_SECRET", () => __awaiter(void 0, void 0, void 0, function* () {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(testUser);
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain("Missing auth configuration");
        process.env.TOKEN_SECRET = originalSecret; // Restore secret
    }));
    test("Refresh with missing refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").send({});
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain("Invalid Token");
    }));
    test("Refresh with invalid refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: "invalidtoken",
        });
        expect(response.statusCode).toBe(403);
        expect(response.text).toContain("Invalid Refresh Token");
    }));
});
//# sourceMappingURL=auth.test.js.map