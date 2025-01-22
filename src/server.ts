
import express, { Express,NextFunction,Request,Response } from "express";
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
import fileRouter from "./routes/file_routes";



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

const delay=async (req: Request, res: Response, next: NextFunction) => {
  await new Promise<void>((r) => setTimeout(()=>r(), 2000));
  next();
}

app.use("/posts", delay,postsRoutes);
app.use("/comments",delay, commentsRoutes);
app.use("/auth",delay, authRoutes);
app.use("/file",fileRouter);
app.use("/public",express.static("public"));
app.use(express.static("front"));
app.get("/about", (req, res) => {res.send("About Page");});



const initApp = ():Promise<Express> => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function(){console.log("Connected to MongoDB");});
    if (!process.env.DB_CONNECTION) {
      return reject("DB_CONNECT is not defined in .env file");
    } else {
      mongoose.connect(process.env.DB_CONNECTION).then(() => {
        return resolve(app);
      }).catch((err) => {
        
        return reject(err);}); 
    }
  });
};

//swagger
const swaggerOptions = {
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
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

export default initApp;
