import express, { Express } from "express";

import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import postsRoutes from "./routes/posts_routes";
import commentsRoutes from "./routes/comments_routes";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth_routes";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/posts", postsRoutes);
app.use("/comments", commentsRoutes);
app.use("/auth", authRoutes);

const db = mongoose.connection;
db.on("error", (err) => {console.error(err);});
db.once("open", () => {console.log("Connected to MongoDB");});

const initApp = async () => {
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.DB_CONNECTION) {
      reject("DB_CONNECT is not defined in .env file");
    } else {
      mongoose.connect(process.env.DB_CONNECTION).then(() => {
        console.log("initApp finish");
        app.get("/about", (req, res) => {
          res.send("About Page");
        });
        resolve(app);
      });
    }
  });
};

export default initApp;
