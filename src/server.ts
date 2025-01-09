
import express, { Express } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import postsRoutes from "./routes/posts_routes";
import commentsRoutes from "./routes/comments_routes";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth_routes";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});
app.use("/posts", postsRoutes);
app.use("/comments", commentsRoutes);
app.use("/auth", authRoutes);
app.get("/about", (req, res) => {res.send("About Page");});

//swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 REST API",
      version: "1.0.0",
      description: "REST server including JWT authentication",
      },
      servers: [{url: "http://localhost:3000",},],
    },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));





const initApp = ():Promise<Express> => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function(){console.log("Connected to MongoDB");});
    if (!process.env.DB_CONNECTION) {
      reject("DB_CONNECT is not defined in .env file");
    } else {
      mongoose.connect(process.env.DB_CONNECTION).then(() => {resolve(app);
      }).catch((err) => {
        reject(err);}); 
    }
  });
};

export default initApp;
