"use strict";
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
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const posts_routes_1 = __importDefault(require("./routes/posts_routes"));
//const { set } = require("mongoose");
//const postsRoutes = require("../routes/posts_routes");
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const db = mongoose_1.default.connection;
        db.on("error", (err) => {
            console.error(err);
        });
        db.once("open", () => {
            console.log("Connected to MongoDB");
        });
        if (process.env.DB_CONNECTION === undefined) {
            console.log("DB_CONNECTION is not set");
            reject();
        }
        else {
            mongoose_1.default.connect(process.env.DB_CONNECTION).then(() => {
                console.log("initApp finish");
                app.use(body_parser_1.default.json());
                app.use(body_parser_1.default.urlencoded({ extended: true }));
                app.use("/posts", posts_routes_1.default);
                app.get("/about", (req, res) => {
                    res.send("About Page");
                });
                resolve(app);
            });
        }
    });
});
exports.default = initApp;
//# sourceMappingURL=server.js.map