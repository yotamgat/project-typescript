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
const mongoose_1 = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const comments_model_1 = __importDefault(require("../models/comments_model"));
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
class PostController {
    constructor() {
        this.createPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("Entered createPost");
            const userId = req.body._id;
            console.log("userId:", userId);
            try {
                const photo = req.body.photo;
                const newPost = yield posts_model_1.default.create({
                    title: req.body.title,
                    content: req.body.content,
                    owner: userId,
                    userImg: req.body.userImg,
                    username: req.body.username,
                    photo,
                });
                res.status(201).json({
                    message: 'Post created successfully',
                    post: newPost,
                });
            }
            catch (error) {
                res.status(500).json({ message: "Failed to create post", error });
            }
        });
        this.savePhoto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log("Entered savePhoto");
            try {
                if (!req.file) {
                    res.status(400).send({ message: "file not found" });
                    return;
                }
                const fileUrl = `/uploads/${req.file.filename}`; // Fixed template string syntax
                const base = process.env.DOMAIN_BASE + "/";
                console.log("fileUrl:", { url: base + ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) });
                res.status(200).send({ url: base + ((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) });
            }
            catch (error) {
                res.status(500).send({ message: "Error uploading file" });
            }
        });
        this.likePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("Entered likePost");
            const postId = req.params.id;
            const { userId } = req.body;
            console.log("postId:", postId);
            console.log("userId:", userId);
            try {
                const post = yield posts_model_1.default.findById(new mongoose_1.Types.ObjectId(postId));
                if (post === null || post === void 0 ? void 0 : post.likedBy.includes(userId)) {
                    post.likedBy = post.likedBy.filter((like) => like.toString() !== userId);
                    post.numOfLikes = post.likedBy.length;
                    yield post.save();
                    res.status(200).json({ message: 'Post unliked', post });
                    return;
                }
                post === null || post === void 0 ? void 0 : post.likedBy.push(userId);
                if (post) {
                    post.numOfLikes = post.likedBy.length;
                }
                yield (post === null || post === void 0 ? void 0 : post.save());
                if (post === null || post === void 0 ? void 0 : post.likedBy) {
                    res.status(200).json({ message: 'Post liked', post });
                }
                else {
                    res.status(400).json({ message: 'Post not liked' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'problem with like post' });
            }
        });
    }
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Entered getAllPosts");
            //const ownerFilter = req.query.owner;
            try {
                const post = yield posts_model_1.default.find();
                res.status(200).json(post);
            }
            catch (error) {
                res.status(400).json({ message: "Failed to fetch posts", error });
            }
        });
    }
    ;
    getPostsByOwner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Entered getPostsByOwner");
                const userId = req.params.owner;
                console.log("req.params:", req.params.owner);
                const posts = yield posts_model_1.default.find({ owner: userId });
                if (posts) {
                    res.status(200).json(posts);
                }
                else {
                    res.status(400).send("Not found");
                }
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Entered getPostById");
            const id = req.params.id;
            console.log("id:", id);
            try {
                const post = yield posts_model_1.default.findById(id);
                if (post) {
                    res.send(post);
                }
                else {
                    res.status(404).send("Not found");
                }
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    ;
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Entered deletePost");
            console.log("req.body:", req.body);
            console.log("req.params:", req.params);
            const id = req.params.id;
            const { owner } = req.body;
            console.log("owner:", owner);
            try {
                // const post = await postModel.findById(new Types.ObjectId(id));
                // if(post?.owner.toString() !== owner){
                //     res.status(400).send({ message: "you are not the owner of this post" });
                //     return;
                // }
                const deletePost = yield posts_model_1.default.findByIdAndDelete(new mongoose_1.Types.ObjectId(id));
                if (deletePost) {
                    yield comments_model_1.default.deleteMany({ postId: new mongoose_1.Types.ObjectId(id) });
                    res.status(200).json({ message: "post deleted" });
                    return;
                }
                else {
                    res.status(400).json({ message: "post not deleted" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "problem with delete post" });
            }
        });
    }
    ;
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Entered updatePost");
            console.log("req.body:", req.body);
            console.log("req.params:", req.params);
            const { id } = req.params;
            const { content, title, owner } = req.body;
            try {
                const post = yield posts_model_1.default.findById(new mongoose_1.Types.ObjectId(id));
                if (owner !== (post === null || post === void 0 ? void 0 : post.owner.toString())) {
                    res.status(400).send({ message: "you are not the owner of this post" });
                    return;
                }
                const postImg = req.body.photo;
                console.log("postImg:", postImg);
                const updatePost = yield posts_model_1.default.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), { content, title, postImg }, { new: true });
                console.log("updatePost:", updatePost);
                if (updatePost) {
                    res.status(201).send(updatePost);
                    return;
                }
                else {
                    res.status(400).send({ message: "post not updated by id" });
                }
            }
            catch (error) {
                res.status(500).send({ message: "problem with updated by id" });
            }
        });
    }
    editPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Entered editPost");
            console.log("req.body:", req.body);
            console.log("req.params:", req.params);
            const { id } = req.params;
            const { content, title, _id } = req.body;
            try {
                const post = yield posts_model_1.default.findById(new mongoose_1.Types.ObjectId(id));
                if (_id !== (post === null || post === void 0 ? void 0 : post.owner.toString())) {
                    res.status(400).send({ message: "you are not the owner of this post" });
                    return;
                }
                const photo = req.body.photo;
                const updatePost = yield posts_model_1.default.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), { content, title, photo }, { new: true });
                if (updatePost) {
                    res.status(201).send(updatePost);
                    return;
                }
                else {
                    res.status(400).send({ message: "post not updated by id" });
                }
            }
            catch (error) {
                res.status(500).send({ message: "problem with updated by id" });
            }
        });
    }
}
exports.default = new PostController();
/*class PostController extends BaseController<IPost> {
  constructor() {
    super(postModel);
  }
  async createItem(req: Request, res: Response) {
      const userId = req.params.userId;
      const post ={
        ...req.body,
        owner: userId
      };
      req.body = post;
      super.createItem(req, res);
  }
}
  */
//# sourceMappingURL=post_controller.js.map