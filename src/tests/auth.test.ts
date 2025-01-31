import request from 'supertest';
import mongoose from 'mongoose';
import initApp from '../server'; // Your Express app
import userModel from '../models/users_model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

const baseUrl = '/auth';
let app: any;

jest.mock('google-auth-library', () => {
  const mOAuth2Client = {
    verifyIdToken: jest.fn(),
  };
  return { OAuth2Client: jest.fn(() => mOAuth2Client) };
});



describe('Auth Controller', () => {
  let testUser: any = {};
  const mockOAuth2Client = new OAuth2Client();

  beforeAll(async () => {
    // Initialize the app
    app = await initApp();
    // Ensure TOKEN_SECRET is set
    if (!process.env.TOKEN_SECRET) {
      process.env.TOKEN_SECRET = 'your-secret-key';
    }
  }, 30000); // Set timeout to 30 seconds

  beforeEach(async () => {
    // Clean up the database before each test
    await userModel.deleteMany({});
    // Create a test user
    testUser = await userModel.create({ email: 'test@example.com', password: await bcrypt.hash('password', 10), username: 'testuser' });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  describe('Google Login', () => {
    test('should login successfully with Google', async () => {
      const mockPayload = {
        email: 'googleuser@example.com',
        name: 'Google User',
      };
  
      (mockOAuth2Client.verifyIdToken as jest.Mock).mockResolvedValueOnce({
        getPayload: () => mockPayload,
      });
  
      const res = await request(app)
        .post(`${baseUrl}/googlelogin`)
        .send({ credential: 'valid-google-token' });
  
      expect(res.status).toBe(200);
      expect(res.body.email).toBe(mockPayload.email);
      expect(res.body.username).toBe(mockPayload.name);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });
  
    test('should return 400 if Google credential is missing', async () => {
      const res = await request(app).post(`${baseUrl}/googlelogin`).send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Missing Google credential');
    });
  
    test('should return 400 if Google token is invalid', async () => {
      (mockOAuth2Client.verifyIdToken as jest.Mock).mockRejectedValueOnce(new Error('Invalid Google token'));
  
      const res = await request(app)
        .post(`${baseUrl}/googlelogin`)
        .send({ credential: 'invalid-google-token' });
  
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Google login failed');
    });
  });

  describe('Register', () => {
    test('should return 400 if email or password is missing', async () => {
      const res = await request(app).post(`${baseUrl}/register`).send({});
      expect(res.status).toBe(400);
      expect(res.text).toBe('Missing email or password');
    });

    test('should register a new user', async () => {
      const res = await request(app)
        .post(`${baseUrl}/register`)
        .send({ email: 'newuser@example.com', password: 'password', username: 'newuser' });
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('newuser@example.com');
    });

    test('should handle errors during registration', async () => {
      jest.spyOn(userModel, 'create').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      const res = await request(app)
        .post(`${baseUrl}/register`)
        .send({ email: 'erroruser@example.com', password: 'password', username: 'erroruser' });
      expect(res.status).toBe(500);
    });
  });

  describe('Login', () => {
    test('should login successfully', async () => {
      const res = await request(app)
        .post(`${baseUrl}/login`)
        .send({ email: 'test@example.com', password: 'password' });
      expect(res.status).toBe(200);
      expect(res.body.email).toBe('test@example.com');
      expect(res.body.accessToken).toBeDefined();
      testUser.accessToken = res.body.accessToken;
      testUser.refreshToken = res.body.refreshToken;
    });
    test('should return 400 if email or password is missing', async () => {
      const res = await request(app).post(`${baseUrl}/login`).send({});
      expect(res.status).toBe(400);
      expect(res.text).toBe('Wrong username or password');
    });

    test('should return 400 if user is not found', async () => {
      const res = await request(app)
        .post(`${baseUrl}/login`)
        .send({ email: 'nonexistent@example.com', password: 'password' });
      expect(res.status).toBe(400);
      expect(res.text).toBe('Wrong username or password');
    });

    test('should return 400 if password format is invalid', async () => {
      const user = await userModel.create({ email: 'invalidpassword@example.com', password: 12345, username: 'invaliduser' });
      const res = await request(app)
        .post(`${baseUrl}/login`)
        .send({ email: 'invalidpassword@example.com', password: 'password' });
      expect(res.status).toBe(400);
      expect(res.text).toBe('Wrong username or password');
    });

    test('should return 400 if password is invalid', async () => {
      const user = await userModel.create({ email: 'wrongpassword@example.com', password: await bcrypt.hash('password', 10), username: 'wronguser' });
      const res = await request(app)
        .post(`${baseUrl}/login`)
        .send({ email: 'wrongpassword@example.com', password: 'wrongpassword' });
      expect(res.status).toBe(400);
      expect(res.text).toBe('Wrong username or password');
    });

    

    test('should handle errors during login', async () => {
      jest.spyOn(userModel, 'findOne').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      const res = await request(app)
        .post(`${baseUrl}/login`)
        .send({ email: 'test@example.com', password: 'password' });
      expect(res.status).toBe(500);
    });
  });

  describe('Logout', () => {
    test('should logout successfully', async () => {
      await userModel.deleteOne({ email: 'test@example.com' });
      const user = await userModel.create({ email: 'test@example.com', password: 'hashedpassword', username: 'testuser', refreshTokens: ['validToken'] });
      const refreshToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET as string);
      user.refreshTokens.push(refreshToken);
      await user.save();
      const res = await request(app).post(`${baseUrl}/logout`).send({ refreshToken });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out successfully.');
    });
    
    test('should return 400 if refresh token is missing', async () => {
      const res = await request(app).post(`${baseUrl}/logout`).send({});
      expect(res.status).toBe(400);
      expect(res.text).toBe('Missing Refresh Token');
    });

    test('should return 400 if auth configuration is missing', async () => {
      const originalTokenSecret = process.env.TOKEN_SECRET;
      delete process.env.TOKEN_SECRET;
      const res = await request(app).post(`${baseUrl}/logout`).send({ refreshToken: 'someToken' });
      expect(res.status).toBe(400);
      expect(res.text).toBe('Missing auth configuration');
      process.env.TOKEN_SECRET = originalTokenSecret;
    });

    test('should return 403 if refresh token is invalid', async () => {
      const res = await request(app).post(`${baseUrl}/logout`).send({ refreshToken: 'invalidToken' });
      expect(res.status).toBe(403);
      expect(res.text).toBe('Invalid Refresh Token');
    });

    test('should return 400 if user is not found', async () => {
      const refreshToken = jwt.sign({ _id: 'nonexistentUserId' }, process.env.TOKEN_SECRET as string);
      const res = await request(app).post(`${baseUrl}/logout`).send({ refreshToken });
      expect(res.status).toBe(400);
      expect(res.text).toBe('Invalid Token');
    });

    test('should return 400 if refresh token is not found in user', async () => {
      await userModel.deleteOne({ email: 'test@example.com' });
      const user = await userModel.create({ email: 'test@example.com', password: 'hashedpassword', username: 'testuser' });
      const refreshToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET as string);
      const res = await request(app).post(`${baseUrl}/logout`).send({ refreshToken });
      expect(res.status).toBe(400);
      expect(res.text).toBe('Invalid Token');
    });

    

    test('should handle errors during logout', async () => {
      jest.spyOn(userModel, 'findById').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      const refreshToken = jwt.sign({ _id: 'someUserId' }, process.env.TOKEN_SECRET as string);
      const res = await request(app).post(`${baseUrl}/logout`).send({ refreshToken });
      expect(res.status).toBe(400);

    });
  });

  describe('Refresh', () => {
    test('should return 400 if refresh token is missing', async () => {
      const res = await request(app).post(`${baseUrl}/refresh`).send({});
      expect(res.status).toBe(400);
      expect(res.text).toBe('Invalid Token');
    });

    test('should return 400 if auth configuration is missing', async () => {
      const originalTokenSecret = process.env.TOKEN_SECRET;
      delete process.env.TOKEN_SECRET;
      const res = await request(app).post(`${baseUrl}/refresh`).send({ refreshToken: 'someToken' });
      expect(res.status).toBe(400);
      expect(res.text).toBe('Missing auth configuration');
      process.env.TOKEN_SECRET = originalTokenSecret;
    });

    test('should return 403 if refresh token is invalid', async () => {
      const res = await request(app).post(`${baseUrl}/refresh`).send({ refreshToken: 'invalidToken' });
      expect(res.status).toBe(403);
      expect(res.text).toBe('Invalid Refresh Token');
    });

    test('should return 400 if user is not found', async () => {
      const refreshToken = jwt.sign({ _id: 'nonexistentUserId' }, process.env.TOKEN_SECRET as string);
      const res = await request(app).post(`${baseUrl}/refresh`).send({ refreshToken });
      expect(res.status).toBe(400);
      expect(res.text).toBe('Invalid Token');
    });

    test('should return 400 if refresh token is not found in user', async () => {
      await userModel.deleteOne({ email: 'test@example.com' });
      const user = await userModel.create({ email: 'test@example.com', password: 'hashedpassword', username: 'testuser' });
      const refreshToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET as string);
      const res = await request(app).post(`${baseUrl}/refresh`).send({ refreshToken });
      expect(res.status).toBe(400);
      expect(res.text).toBe('Invalid Token');
    });

    test('should refresh tokens successfully', async () => {
      await userModel.deleteOne({ email: 'test@example.com' });
      const user = await userModel.create({ email: 'test@example.com', password: 'hashedpassword', username: 'testuser', refreshTokens: ['validToken'] });
      const refreshToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET as string);
      user.refreshTokens.push(refreshToken);
      await user.save();
      const res = await request(app).post(`${baseUrl}/refresh`).send({ refreshToken });
      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    test('should handle errors during token refresh', async () => {
      jest.spyOn(userModel, 'findById').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      const refreshToken = jwt.sign({ _id: 'someUserId' }, process.env.TOKEN_SECRET as string);
      const res = await request(app).post(`${baseUrl}/refresh`).send({ refreshToken });
      expect(res.status).toBe(400);
    });
  });

  describe('Auth Middleware', () => {
    test('should return 401 if token is missing', async () => {
      const res = await request(app).get('/auth/user');
      expect(res.status).toBe(401);
      expect(res.text).toBe('Missing Token');
    });

    test('should return 500 if auth configuration is missing', async () => {
      const originalTokenSecret = process.env.TOKEN_SECRET;
      delete process.env.TOKEN_SECRET;
      const res = await request(app).get('/auth/user').set('Authorization', 'Bearer someToken');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Missing authentication configuration');
      process.env.TOKEN_SECRET = originalTokenSecret;
    });

    test('should return 403 if token is invalid', async () => {
      const res = await request(app).get('/auth/user').set('Authorization', 'Bearer invalidToken');
      expect(res.status).toBe(403);
      expect(res.text).toBe('Invalid Token');
    });

    test('should allow access with valid token', async () => {
      const token = jwt.sign({ _id: testUser._id }, process.env.TOKEN_SECRET as string);
      const res = await request(app).get('/auth/user').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe('User Info', () => {
    test('should get user info', async () => {
      const token = jwt.sign({ _id: testUser._id }, process.env.TOKEN_SECRET as string);
      const res = await request(app).get(`${baseUrl}/user`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.userId).toBe(testUser._id.toString());
    });

    test('should return 401 if token is missing for user info', async () => {
      const res = await request(app).get(`${baseUrl}/user`);
      expect(res.status).toBe(401);
      expect(res.text).toBe('Missing Token');
    });

    test('should return 403 if token is invalid for user info', async () => {
      const res = await request(app).get(`${baseUrl}/user`).set('Authorization', 'Bearer invalidToken');
      expect(res.status).toBe(403);
      expect(res.text).toBe('Invalid Token');
    });
  });

  describe('Profile Update', () => {
    test('should update user profile', async () => {
      const token = jwt.sign({ _id: testUser._id }, process.env.TOKEN_SECRET as string);
      const res = await request(app)
        .post(`${baseUrl}/user/update`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          _id: testUser._id,
          userImg: 'newimage.jpg',
          username: 'updateduser'
        });
      expect(res.status).toBe(200);
      expect(res.body.user.username).toBe('updateduser');
    });

    test('should not update user profile without token', async () => {
      const res = await request(app)
        .post(`${baseUrl}/user/update`)
        .send({
          _id: testUser._id,
          userImg: 'newimage.jpg',
          username: 'updateduser'
        });
      expect(res.status).toBe(401);
    });

    test('should return 403 if token is invalid for profile update', async () => {
      const res = await request(app)
        .post(`${baseUrl}/user/update`)
        .set('Authorization', 'Bearer invalidToken')
        .send({
          _id: testUser._id,
          userImg: 'newimage.jpg',
          username: 'updateduser'
        });
      expect(res.status).toBe(403);
      expect(res.text).toBe('Invalid Token');
    });
  });
});