"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
router.get("/", post_controller_1.default.getAllPosts);
router.get("/:id", (req, res) => {
    post_controller_1.default.getPostById(req, res);
});
router.post("/", post_controller_1.default.createPost);
router.delete("/:id", post_controller_1.default.deletePost); //delete the post with specific id
exports.default = router;
//# sourceMappingURL=posts_routes.js.map