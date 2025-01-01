"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comment_controller_1 = __importDefault(require("../controllers/comment_controller"));
router.get("/", comment_controller_1.default.getAll.bind(comment_controller_1.default));
router.get("/:id", (req, res) => {
    comment_controller_1.default.getById(req, res);
});
router.post("/", comment_controller_1.default.create.bind(comment_controller_1.default));
router.delete("/:id", comment_controller_1.default.deleteById.bind(comment_controller_1.default)); //delete the post with specific id
exports.default = router;
//# sourceMappingURL=comments_routes.js.map