import request from "supertest"; // to test HTTP requests/responses
import initApp from "../server"; // Link to your server file
import mongoose from "mongoose";
import { Express } from "express";
import userModel, { IUser} from "../models/users_model";
import postModel from "../models/posts_model";

let app: Express;

// runs before all tests
beforeAll(async () => {
  app = await initApp();
  console.log("before all tests");
  await userModel.deleteMany({}); // delete all users
  await postModel.deleteMany({}); // delete all posts
});

// runs after all tests
afterAll(() => {
  console.log("after all tests");
  mongoose.connection.close();
});

const baseUrl = "/auth";



type UserInfo =  {
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
  _id?: string;
};

const testUser: UserInfo = {
  email: "test@user.com",
  password: "testpassword",
}
//describe creates a block that groups together several related tests
describe("Auth Test", () => {
  test("Auth Register", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).toBe(200);
  });
  test("Auth Registeration Fail", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth test login", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    const userId = response.body._id;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(userId).toBeDefined();
    testUser.accessToken = accessToken;
    testUser.refreshToken= refreshToken;
    testUser._id = userId;
  });

  test("Make sure two access tokens are not the same", async () => {
    const response = await request(app).post(baseUrl + "/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(response.body.accessToken).not.toEqual(testUser.accessToken);
  });

  test("Get Protected API", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post",
      content: "Test Content",
      owner: "sdfSd",
    });
    expect(response.statusCode).not.toBe(201);
    const response2 = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send({
        title: "Test Post",
        content: "Test Content",
        owner: "sdfSd",
      });
    expect(response2.statusCode).toBe(201);
  });

  test("Get Protected API Invalid Token", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post",
      content: "Test Content",
      owner: "sdfSd",
    });
    expect(response.statusCode).not.toBe(201);
    const response2 = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.accessToken +'1' })
      .send({
        title: testUser._id,
        content: "Test Content",
        owner: "sdfSd",
      });
    expect(response2.statusCode).not.toBe(201);
  });

 

  test("Refresh Token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;

  });

  test("Logout - Invalidate Refresh Token", async () => {
    const response = await request(app).post(baseUrl + "/logout").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    const response2 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response2.statusCode).not.toBe(200);
  }); 

  test("Refresh Toekn Multiple Usage", async () => { 
    // login- get a refresh token
    const response = await request(app).post(baseUrl + "/login").send({
      email: testUser.email,
      password: testUser.password,
      
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;


    //first time use the refresh token and get a new refresh token
    const response2 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response2.statusCode).toBe(200);
    const newRefreshToken = response2.body.refreshToken;

    //second time use the old refresh token and expect to fail
    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response3.statusCode).not.toBe(200);

    //try to use the new refresh token and expect to fail
    const response4 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: newRefreshToken,
    });
    expect(response4.statusCode).not.toBe(200);
  });

  jest.setTimeout(10000);
  test("Timout on access token", async () => {
    const response = await request(app).post(baseUrl + "/login").send({
      email: testUser.email,
      password: testUser.password,
      
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;  

    //wait for 6 seconds
    await new Promise((resolve) => setTimeout(resolve, 6000));

    //try to access with expired token
    const response2 = await request(app).post("/posts").set
    ({ authorization: "JWT " + testUser.accessToken }).send({
      title: "Test Post",
      content: "Test Content",
      owner: "sdfSd",
    });
    expect(response2.statusCode).not.toBe(201);

    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response3.statusCode).toBe(200);
    testUser.accessToken = response3.body.accessToken;
    testUser.refreshToken = response3.body.refreshToken;  

    const response4 = await request(app).post("/posts").set
    ({ authorization: "JWT " + testUser.accessToken }).send({
      title: "Test Post",
      content: "Test Content",
      owner: "sdfSd",
    });
    expect(response4.statusCode).toBe(201);


  });
});