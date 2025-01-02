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
let app;
// runs before all tests
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    console.log("before all tests");
    //await postModel.deleteMany();
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
//describe creates a block that groups together several related tests
describe("Auth Test", () => {
    test("Auth test register", () => __awaiter(void 0, void 0, void 0, function* () {
        //example for test
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/register")
            .send(testUser);
        expect(response.statusCode).toBe(200);
    }));
    test("Auth test login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send(testUser);
        expect(response.statusCode).toBe(200);
        const token = response.body.token;
        expect(token).toBeDefined();
        expect(response.body._id).toBeDefined();
        testUser.token = token;
        testUser._id = response.body._id;
    }));
    test("Auth test me", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send({
            title: "Test Post",
            content: "Test Content",
            owner: "sdfSd",
        });
        expect(response.statusCode).not.toBe(201);
        const response2 = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set({ authorization: "JWT" + testUser.token })
            .send({
            title: "Test Post",
            content: "Test Content",
            owner: "sdfSd",
        });
        expect(response2.statusCode).toBe(201);
    }));
});
//# sourceMappingURL=auth.test.js.map