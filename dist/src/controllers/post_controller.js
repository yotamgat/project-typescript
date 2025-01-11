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
class PostController {
    constructor() {
        this.createPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const userId = req.userId; // Ensure this matches the route parameter name
            if (!userId) {
                res.status(400).send("Missing userId query parameter");
                return;
            }
            const { title, content } = req.body;
            if (!title || !content) {
                res.status(400).send("Missing title or content in request body");
            }
            try {
                const post = yield posts_model_1.default.create({
                    title,
                    content,
                    owner: userId,
                });
                res.status(201).send(post);
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ownerFilter = req.query.owner;
            try {
                if (ownerFilter) {
                    const post = yield posts_model_1.default.find({ owner: ownerFilter });
                    res.send(post);
                }
                else {
                    const post = yield posts_model_1.default.find();
                    res.send(post);
                }
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    ;
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const post = yield posts_model_1.default.findById(id);
                if (post != null) {
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
            const id = req.params.id;
            try {
                const rs = yield posts_model_1.default.findByIdAndDelete(id);
                res.status(200).send("Post Deleted");
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    ;
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const body = req.body;
            try {
                const post = yield posts_model_1.default.findByIdAndUpdate(id, body, { new: true });
                res.status(200).send(post);
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    ;
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