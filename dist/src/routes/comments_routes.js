"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comment_controller_1 = __importDefault(require("../controllers/comment_controller"));
const auth_controller_1 = require("../controllers/auth_controller");
router.get("/:id", comment_controller_1.default.getCommentById.bind(comment_controller_1.default));
router.get("/", comment_controller_1.default.getAllComments.bind(comment_controller_1.default));
router.get("/get-all-comments/:postId", comment_controller_1.default.getAllCommentsByPostId.bind(comment_controller_1.default));
router.post("/", auth_controller_1.authMiddleware, comment_controller_1.default.createComment.bind(comment_controller_1.default));
router.put("/:id", auth_controller_1.authMiddleware, comment_controller_1.default.updateComment.bind(comment_controller_1.default));
router.delete("/:id", auth_controller_1.authMiddleware, comment_controller_1.default.deleteComment.bind(comment_controller_1.default)); //delete the post with specific id
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - userId
 *         - postId
 *         - text
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the comment
 *         userId:
 *           type: string
 *           description: ID of the user who created the comment
 *         postId:
 *           type: string
 *           description: ID of the post the comment is associated with
 *         text:
 *           type: string
 *           description: The content of the comment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time the comment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last time the comment was updated
 */
/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: The content of the comment
 *                 example: This is a comment
 *               postId:
 *                type: string
 *                description: The ID of the post the comment is associated with
 *                example: 60f3b4b3b3b3b3b3b3b3b3
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *       404:
 *         description: Comment not found
 */
/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: The content of the comment
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
/**
 * @swagger
 * /comments/get-all-comments/{postId}:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       400:
 *         description: postId is required
 *       404:
 *         description: Post not found
 */
exports.default = router;
//# sourceMappingURL=comments_routes.js.map