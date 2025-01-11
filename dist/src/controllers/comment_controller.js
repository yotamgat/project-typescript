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
const comments_model_1 = __importDefault(require("../models/comments_model"));
class CommentController {
    getAllComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield comments_model_1.default.find();
                res.send(comments);
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    getAllCommentsByPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.query.postId;
            console.log("Received postId:", postId);
            if (!postId) {
                res.status(400).send("PostId is required");
            }
            try {
                const comments = yield comments_model_1.default.find({ postId });
                res.status(200).send(comments);
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    getCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const comment = yield comments_model_1.default.findById(id);
                if (comment != null) {
                    res.status(200).send(comment);
                }
                else {
                    res.status(404).send("Not found");
                }
            }
            catch (err) {
                res.status(404).send(err);
            }
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const rs = yield comments_model_1.default.findByIdAndDelete(id);
                res.status(200).send("Comment Deleted");
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const comment = Object.assign(Object.assign({}, req.body), { owner: userId });
            console.log(req.body);
            req.body = comment;
            try {
                const comment = yield comments_model_1.default.create(req.body);
                res.status(201).send(comment);
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const body = req.body;
            try {
                const comment = yield comments_model_1.default.findByIdAndUpdate(id, body, { new: true });
                res.status(200).send(comment);
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
}
exports.default = new CommentController();
//# sourceMappingURL=comment_controller.js.map