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
const posts_model_1 = __importDefault(require("../models/posts_model"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ownerFilter = req.query.owner;
    try {
        if (ownerFilter) {
            const posts = yield posts_model_1.default.find({ owner: ownerFilter });
            res.status(200).send(posts);
        }
        else {
            const posts = yield posts_model_1.default.find();
            res.status(200).send(posts);
        }
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    try {
        const post = yield posts_model_1.default.findById(postId);
        if (post === null) {
            return res.status(404).send("Post not found");
        }
        else {
            return res.status(200).send(post);
        }
        res.status(200).send(post);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = req.body;
    try {
        const newPost = yield posts_model_1.default.create(post);
        res.status(201).send(newPost);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    try {
        yield posts_model_1.default.findByIdAndDelete(postId);
        res.status(200).send();
    }
    catch (err) {
        res.status(400).send(err);
    }
});
exports.default = { getAllPosts, getPostById, createPost, deletePost };
//# sourceMappingURL=post_controller.js.map