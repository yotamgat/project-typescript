"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
const auth_controller_1 = require("../controllers/auth_controller");
router.get("/", post_controller_1.default.getAll.bind(post_controller_1.default));
router.get("/:id", post_controller_1.default.getById.bind(post_controller_1.default));
router.post("/", auth_controller_1.authMiddleware, post_controller_1.default.create.bind(post_controller_1.default));
router.delete("/:id", auth_controller_1.authMiddleware, post_controller_1.default.deleteItem.bind(post_controller_1.default)); //delete the post with specific id
exports.default = router;
//# sourceMappingURL=posts_routes.js.map