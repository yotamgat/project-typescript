"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
const auth_controller_1 = require("../controllers/auth_controller");
router.get("/", (req, res) => {
    post_controller_1.default.getAll(req, res);
});
router.get("/:id", (req, res) => {
    post_controller_1.default.getById(req, res);
});
router.post("/", auth_controller_1.authMiddleware, (req, res) => {
    post_controller_1.default.create(req, res);
});
router.delete("/:id", auth_controller_1.authMiddleware, (req, res) => {
    post_controller_1.default.deleteItem(req, res);
});
//router.get("/", postController.getAll.bind(postController));
//router.get("/:id", postController.getById.bind(postController));
//router.post("/", authMiddleware ,postController.create.bind(postController));
//router.delete("/:id", authMiddleware ,postController.deleteItem.bind(postController)); //delete the post with specific id
exports.default = router;
//# sourceMappingURL=posts_routes.js.map