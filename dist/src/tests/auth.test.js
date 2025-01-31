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
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("../server")); // Your Express app
const users_model_1 = __importDefault(require("../models/users_model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const google_auth_library_1 = require("google-auth-library");
const baseUrl = '/auth';
let app;
jest.mock('google-auth-library', () => {
    const mOAuth2Client = {
        verifyIdToken: jest.fn(),
    };
    return { OAuth2Client: jest.fn(() => mOAuth2Client) };
});
describe('Auth Controller', () => {
    let testUser = {};
    const mockOAuth2Client = new google_auth_library_1.OAuth2Client();
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
        // Create a test user
        testUser = yield users_model_1.default.create({ email: 'test@example.com', password: yield bcrypt_1.default.hash('password', 10), username: 'testuser' });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
    describe('Google Login', () => {
        test('should login successfully with Google', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPayload = {
                email: 'googleuser@example.com',
                name: 'Google User',
            };
            mockOAuth2Client.verifyIdToken.mockResolvedValueOnce({
                getPayload: () => mockPayload,
            });
            const res = yield (0, supertest_1.default)(app)
                .post(`${baseUrl}/googlelogin`)
                .send({ credential: 'valid-google-token' });
            expect(res.status).toBe(200);
            expect(res.body.email).toBe(mockPayload.email);
            expect(res.body.username).toBe(mockPayload.name);
            expect(res.body.accessToken).toBeDefined();
            expect(res.body.refreshToken).toBeDefined();
        }));
        test('should return 400 if Google credential is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/googlelogin`).send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Missing Google credential');
        }));
        test('should return 400 if Google token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockOAuth2Client.verifyIdToken.mockRejectedValueOnce(new Error('Invalid Google token'));
            const res = yield (0, supertest_1.default)(app)
                .post(`${baseUrl}/googlelogin`)
                .send({ credential: 'invalid-google-token' });
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Google login failed');
        }));
    });
    describe('Register', () => {
        test('should return 400 if email or password is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/register`).send({});
            expect(res.status).toBe(400);
            expect(res.text).toBe('Missing email or password');
        }));
        test('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post(`${baseUrl}/register`)
                .send({ email: 'newuser@example.com', password: 'password', username: 'newuser' });
            expect(res.status).toBe(200);
            expect(res.body.user.email).toBe('newuser@example.com');
        }));
        test('should handle errors during registration', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(users_model_1.default, 'create').mockImplementationOnce(() => {
                throw new Error('Database error');
            });
            const res = yield (0, supertest_1.default)(app)
                .post(`${baseUrl}/register`)
                .send({ email: 'erroruser@example.com', password: 'password', username: 'erroruser' });
            expect(res.status).toBe(500);
        }));
    });
    describe('Login', () => {
        test('should login successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post(`${baseUrl}/login`)
                .send({ email: 'test@example.com', password: 'password' });
            expect(res.status).toBe(200);
            expect(res.body.email).toBe('test@example.com');
            expect(res.body.accessToken).toBeDefined();
            testUser.accessToken = res.body.accessToken;
            testUser.refreshToken = res.body.refreshToken;
        }));
        test('should return 400 if email or password is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/login`).send({});
            expect(res.status).toBe(400);
            expect(res.text).toBe('Wrong username or password');
        }));
        test('should return 400 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post(`${baseUrl}/login`)
                .send({ email: 'nonexistent@example.com', password: 'password' });
            expect(res.status).toBe(400);
            expect(res.text).toBe('Wrong username or password');
        }));
        test('should return 400 if password format is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield users_model_1.default.create({ email: 'invalidpassword@example.com', password: 12345, username: 'invaliduser' });
            const res = yield (0, supertest_1.default)(app)
                .post(`${baseUrl}/login`)
                .send({ email: 'invalidpassword@example.com', password: 'password' });
            expect(res.status).toBe(400);
            expect(res.text).toBe('Wrong username or password');
        }));
        test('should return 400 if password is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield users_model_1.default.create({ email: 'wrongpassword@example.com', password: yield bcrypt_1.default.hash('password', 10), username: 'wronguser' });
            const res = yield (0, supertest_1.default)(app)
                .post(`${baseUrl}/login`)
                .send({ email: 'wrongpassword@example.com', password: 'wrongpassword' });
            expect(res.status).toBe(400);
            expect(res.text).toBe('Wrong username or password');
        }));
        test('should handle errors during login', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(users_model_1.default, 'findOne').mockImplementationOnce(() => {
                throw new Error('Database error');
            });
            const res = yield (0, supertest_1.default)(app)
                .post(`${baseUrl}/login`)
                .send({ email: 'test@example.com', password: 'password' });
            expect(res.status).toBe(500);
        }));
    });
    describe('Logout', () => {
        test('should logout successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            yield users_model_1.default.deleteOne({ email: 'test@example.com' });
            const user = yield users_model_1.default.create({ email: 'test@example.com', password: 'hashedpassword', username: 'testuser', refreshTokens: ['validToken'] });
            const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.TOKEN_SECRET);
            user.refreshTokens.push(refreshToken);
            yield user.save();
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/logout`).send({ refreshToken });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Logged out successfully.');
        }));
        test('should return 400 if refresh token is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/logout`).send({});
            expect(res.status).toBe(400);
            expect(res.text).toBe('Missing Refresh Token');
        }));
        test('should return 400 if auth configuration is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const originalTokenSecret = process.env.TOKEN_SECRET;
            delete process.env.TOKEN_SECRET;
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/logout`).send({ refreshToken: 'someToken' });
            expect(res.status).toBe(400);
            expect(res.text).toBe('Missing auth configuration');
            process.env.TOKEN_SECRET = originalTokenSecret;
        }));
        test('should return 403 if refresh token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/logout`).send({ refreshToken: 'invalidToken' });
            expect(res.status).toBe(403);
            expect(res.text).toBe('Invalid Refresh Token');
        }));
        test('should return 400 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const refreshToken = jsonwebtoken_1.default.sign({ _id: 'nonexistentUserId' }, process.env.TOKEN_SECRET);
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/logout`).send({ refreshToken });
            expect(res.status).toBe(400);
            expect(res.text).toBe('Invalid Token');
        }));
        test('should return 400 if refresh token is not found in user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield users_model_1.default.deleteOne({ email: 'test@example.com' });
            const user = yield users_model_1.default.create({ email: 'test@example.com', password: 'hashedpassword', username: 'testuser' });
            const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.TOKEN_SECRET);
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/logout`).send({ refreshToken });
            expect(res.status).toBe(400);
            expect(res.text).toBe('Invalid Token');
        }));
        test('should handle errors during logout', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(users_model_1.default, 'findById').mockImplementationOnce(() => {
                throw new Error('Database error');
            });
            const refreshToken = jsonwebtoken_1.default.sign({ _id: 'someUserId' }, process.env.TOKEN_SECRET);
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/logout`).send({ refreshToken });
            expect(res.status).toBe(400);
        }));
    });
    describe('Refresh', () => {
        test('should return 400 if refresh token is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/refresh`).send({});
            expect(res.status).toBe(400);
            expect(res.text).toBe('Invalid Token');
        }));
        test('should return 400 if auth configuration is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const originalTokenSecret = process.env.TOKEN_SECRET;
            delete process.env.TOKEN_SECRET;
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/refresh`).send({ refreshToken: 'someToken' });
            expect(res.status).toBe(400);
            expect(res.text).toBe('Missing auth configuration');
            process.env.TOKEN_SECRET = originalTokenSecret;
        }));
        test('should return 403 if refresh token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/refresh`).send({ refreshToken: 'invalidToken' });
            expect(res.status).toBe(403);
            expect(res.text).toBe('Invalid Refresh Token');
        }));
        test('should return 400 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const refreshToken = jsonwebtoken_1.default.sign({ _id: 'nonexistentUserId' }, process.env.TOKEN_SECRET);
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/refresh`).send({ refreshToken });
            expect(res.status).toBe(400);
            expect(res.text).toBe('Invalid Token');
        }));
        test('should return 400 if refresh token is not found in user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield users_model_1.default.deleteOne({ email: 'test@example.com' });
            const user = yield users_model_1.default.create({ email: 'test@example.com', password: 'hashedpassword', username: 'testuser' });
            const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.TOKEN_SECRET);
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/refresh`).send({ refreshToken });
            expect(res.status).toBe(400);
            expect(res.text).toBe('Invalid Token');
        }));
        test('should refresh tokens successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            yield users_model_1.default.deleteOne({ email: 'test@example.com' });
            const user = yield users_model_1.default.create({ email: 'test@example.com', password: 'hashedpassword', username: 'testuser', refreshTokens: ['validToken'] });
            const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.TOKEN_SECRET);
            user.refreshTokens.push(refreshToken);
            yield user.save();
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/refresh`).send({ refreshToken });
            expect(res.status).toBe(200);
            expect(res.body.accessToken).toBeDefined();
            expect(res.body.refreshToken).toBeDefined();
        }));
        test('should handle errors during token refresh', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(users_model_1.default, 'findById').mockImplementationOnce(() => {
                throw new Error('Database error');
            });
            const refreshToken = jsonwebtoken_1.default.sign({ _id: 'someUserId' }, process.env.TOKEN_SECRET);
            const res = yield (0, supertest_1.default)(app).post(`${baseUrl}/refresh`).send({ refreshToken });
            expect(res.status).toBe(400);
        }));
    });
    describe('Auth Middleware', () => {
        test('should return 401 if token is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).get('/auth/user');
            expect(res.status).toBe(401);
            expect(res.text).toBe('Missing Token');
        }));
        test('should return 500 if auth configuration is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const originalTokenSecret = process.env.TOKEN_SECRET;
            delete process.env.TOKEN_SECRET;
            const res = yield (0, supertest_1.default)(app).get('/auth/user').set('Authorization', 'Bearer someToken');
            expect(res.status).toBe(500);
            expect(res.text).toBe('Missing authentication configuration');
            process.env.TOKEN_SECRET = originalTokenSecret;
        }));
        test('should return 403 if token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).get('/auth/user').set('Authorization', 'Bearer invalidToken');
            expect(res.status).toBe(403);
            expect(res.text).toBe('Invalid Token');
        }));
        test('should allow access with valid token', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({ _id: testUser._id }, process.env.TOKEN_SECRET);
            const res = yield (0, supertest_1.default)(app).get('/auth/user').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        }));
    });
    describe('User Info', () => {
        test('should get user info', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({ _id: testUser._id }, process.env.TOKEN_SECRET);
            const res = yield (0, supertest_1.default)(app).get(`${baseUrl}/user`).set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.userId).toBe(testUser._id.toString());
        }));
        test('should return 401 if token is missing for user info', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).get(`${baseUrl}/user`);
            expect(res.status).toBe(401);
            expect(res.text).toBe('Missing Token');
        }));
        test('should return 403 if token is invalid for user info', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).get(`${baseUrl}/user`).set('Authorization', 'Bearer invalidToken');
            expect(res.status).toBe(403);
            expect(res.text).toBe('Invalid Token');
        }));
    });
    describe('Profile Update', () => {
        test('should update user profile', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({ _id: testUser._id }, process.env.TOKEN_SECRET);
            const res = yield (0, supertest_1.default)(app)
                .post(`${baseUrl}/user/update`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                _id: testUser._id,
                userImg: 'newimage.jpg',
                username: 'updateduser'
            });
            expect(res.status).toBe(200);
            expect(res.body.user.username).toBe('updateduser');
        }));
        test('should not update user profile without token', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post(`${baseUrl}/user/update`)
                .send({
                _id: testUser._id,
                userImg: 'newimage.jpg',
                username: 'updateduser'
            });
            expect(res.status).toBe(401);
        }));
        test('should return 403 if token is invalid for profile update', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post(`${baseUrl}/user/update`)
                .set('Authorization', 'Bearer invalidToken')
                .send({
                _id: testUser._id,
                userImg: 'newimage.jpg',
                username: 'updateduser'
            });
            expect(res.status).toBe(403);
            expect(res.text).toBe('Invalid Token');
        }));
    });
});
//# sourceMappingURL=auth.test.js.map