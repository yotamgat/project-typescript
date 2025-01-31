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
const users_model_1 = __importDefault(require("../models/users_model"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
const mongoose_1 = require("mongoose");
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
            console.log("Entered getAllCommentsByPostId");
            const postId = req.params.postId;
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
            console.log("Entered deleteComment");
            console.log("req.body", req.body);
            console.log("req.params", req.params);
            const commentId = req.params.id;
            const { userId } = req.body;
            console.log("commentId", commentId);
            console.log("userId", userId);
            try {
                const comment = yield comments_model_1.default.findById(new mongoose_1.Types.ObjectId(commentId));
                console.log("comment", comment);
                //if(comment?.owner.toString() !== userId) {
                //  res.status(400).send({ message: "you are not the owner of this comment" });
                //   return;
                //}
                yield comments_model_1.default.findByIdAndDelete(new mongoose_1.Types.ObjectId(commentId));
                yield posts_model_1.default.findByIdAndUpdate(comment === null || comment === void 0 ? void 0 : comment.postId, { $inc: { numOfComments: -1 } });
                res.status(200).send({ message: "comment deleted successfully" });
                return;
            }
            catch (error) {
                res.status(400).send({ message: "internal server error" });
            }
        });
    }
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Entered createComment");
            console.log("req.body aa", req.body);
            const comment = req.body.comment;
            const postId = req.body.postId;
            const userId = req.body.owner;
            try {
                const user = yield users_model_1.default.findById(new mongoose_1.Types.ObjectId(userId));
                const username = user === null || user === void 0 ? void 0 : user.username;
                console.log("username", username);
                const userImg = user === null || user === void 0 ? void 0 : user.image;
                console.log("img", userImg);
                const newComment = yield comments_model_1.default.create({
                    comment,
                    postId: new mongoose_1.Types.ObjectId(postId),
                    username,
                    owner: new mongoose_1.Types.ObjectId(userId),
                    userImg
                });
                if (newComment) {
                    yield posts_model_1.default.findByIdAndUpdate(new mongoose_1.Types.ObjectId(postId), { $inc: { numOfComments: 1 } }, { new: true });
                    res.status(201).send(newComment);
                    return;
                }
                else {
                    res.status(400).send("problem with new comment");
                }
            }
            catch (error) {
                res.status(400).send({ message: "internal server error" });
            }
        });
    }
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Entered updateComment");
            console.log("req.body", req.body);
            console.log("req.params", req.params);
            console.log("req.body.commentData", req.body.commentData);
            const commentId = req.params.id;
            const { comment, postId, userImg, username, owner } = req.body;
            try {
                const updatedComment = yield comments_model_1.default.findByIdAndUpdate(new mongoose_1.Types.ObjectId(commentId), { comment, postId, userImg, username, owner }, { new: true });
                console.log("commentId", commentId);
                console.log("updatedComment", updatedComment);
                if (updatedComment) {
                    res.status(200).send(updatedComment);
                    return;
                }
                else {
                    res.status(400).send("problem with new");
                    return;
                }
            }
            catch (error) {
                res.status(400).send({ message: "internal server error" });
            }
        });
    }
}
exports.default = new CommentController();
//# sourceMappingURL=comment_controller.js.map