/*
import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
const bodyParser = require("body-parser");
import mongoose from "mongoose";
//const { set } = require("mongoose");
const postsRoutes = require("../routes/posts_routes");

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

// body parser will help us to take the data from the user
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/posts", postsRoutes);

app.get("/about", (req, res) => {
  res.send("Hello World!!!!!!!!");
});

const initApp = () => {
  return new Promise(async (resolve, reject) => {
    await mongoose.connect(process.env.DB_CONNECTION);
    resolve(app);
  });
};

export default initApp;*/

import express, { Express } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postsRoutes from "./routes/posts_routes";
//const { set } = require("mongoose");
//const postsRoutes = require("../routes/posts_routes");

const initApp = async () => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on("error", (err) => {
      console.error(err);
    });
    db.once("open", () => {
      console.log("Connected to MongoDB");
    });

    if (process.env.DB_CONNECTION === undefined) {
      console.log("DB_CONNECTION is not set");
      reject();
    } else {
      mongoose.connect(process.env.DB_CONNECTION).then(() => {
        console.log("initApp finish");

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use("/posts", postsRoutes);

        app.get("/about", (req, res) => {
          res.send("About Page");
        });
        resolve(app);
      });
    }
  });
};

export default initApp;
