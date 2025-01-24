import request from "supertest"; // to test HTTP requests/responses
import initApp from "../server"; // Link to your server file
import mongoose from "mongoose";
import  { Express } from "express";


let app: Express;

// runs before all tests
beforeAll(async () => {
  app = await initApp();
  
});

// runs after all tests
afterAll(() => {
  mongoose.connection.close();
});


describe("File Test Suite", () => {
    test("File Upload Test", async () => {
        const filePath = `${__dirname}/avatar2.png`;
        try {
            const response = await request(app)
                .post("/file?file=test_file.jpeg").attach('file', filePath)
            expect(response.statusCode).toEqual(200);
            let url = response.body.url;
            console.log(url);
            url = url.replace(/^.*\/\/[^/]+/, '')
            console.log(url);

            const res = await request(app).get(url)
            expect(res.statusCode).toEqual(200);
        } catch (err) {
            console.log(err);
            expect(1).toEqual(2);
        }
    });
}); 