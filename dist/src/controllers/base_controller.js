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
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    constructor(model) {
        this.model = model;
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ownerFilter = req.query.owner;
            try {
                if (ownerFilter) {
                    const posts = yield this.model.find({ owner: ownerFilter });
                    res.status(200).send(posts);
                }
                else {
                    const posts = yield this.model.find();
                    res.status(200).send(posts);
                }
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.id;
            try {
                const post = yield this.model.findById(postId);
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
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            try {
                const newPost = yield this.model.create(post);
                res.status(201).send(newPost);
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.id;
            try {
                yield this.model.findByIdAndDelete(postId);
                res.status(200).send();
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
}
const createController = (model) => {
    return new BaseController(model);
};
exports.default = createController;
//# sourceMappingURL=base_controller.js.map