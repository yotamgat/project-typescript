"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
const auth_controller_1 = require("../controllers/auth_controller");
const multerMiddleware_1 = __importDefault(require("../middleware/multerMiddleware"));
const router = express_1.default.Router();
router.get("/", post_controller_1.default.getAllPosts.bind(post_controller_1.default));
router.get("/:id", post_controller_1.default.getPostById.bind(post_controller_1.default));
router.post("/", auth_controller_1.authMiddleware, post_controller_1.default.createPost.bind(post_controller_1.default));
router.delete("/:id", auth_controller_1.authMiddleware, post_controller_1.default.deletePost.bind(post_controller_1.default));
router.put("/:id", auth_controller_1.authMiddleware, post_controller_1.default.updatePost.bind(post_controller_1.default));
router.get('/get-all-posts/:owner', auth_controller_1.authMiddleware, post_controller_1.default.getPostsByOwner.bind(post_controller_1.default));
router.post('/upload', auth_controller_1.authMiddleware, multerMiddleware_1.default, post_controller_1.default.savePhoto);
router.put('/like/:id', auth_controller_1.authMiddleware, post_controller_1.default.likePost);
router.put("/edit/:id", auth_controller_1.authMiddleware, post_controller_1.default.editPost.bind(post_controller_1.default));
/**
 * @swagger
 * tags:
 *  name: Posts
 *  description: The Posts API
*/
/**
* @swagger
* /posts/get-all-posts/{owner}:
*   get:
*     summary: Get all owner posts
*     tags: [Posts]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: query
*         name: owner
*         schema:
*           type: string
*         required: true
*         description: The owner ID
*     responses:
*       200:
*         description: Comments retrieved successfully
*       400:
*         description: ownerId is required
*       404:
*         description: Post not found
*/
/**
* @swagger
* /posts:
*   get:
*     summary: Get all posts
*     description: Retrieve all posts
*     tags: [Posts]
*     responses:
*       200:
*         description: Post retrieved successfully
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   title:
*                     type: string
*                   content:
*                     type: string
*                   owner:
*                     type: string
*                   _id:
*                     type: string
*       500:
*         description: Internal server error
*/
/**
* @swagger
* /posts/{id}:
*   get:
*     summary: Get a post by ID
*     description: Retrieve a post by its ID
*     tags: [Posts]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the post to retrieve
*     responses:
*       200:
*         description: Post retrieved successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 title:
*                   type: string
*                 content:
*                   type: string
*                 owner:
*                   type: string
*                 _id:
*                   type: string
*       404:
*         description: Post not found
*       500:
*         description: Internal server error
*/
/**
* @swagger
* /posts:
*   post:
*     summary: Add a new post
*     tags: [Posts]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*                  title:
*                      type: string
*                      description: The Post Title
*                      example: "My first post"
*                  content:
*                      type: string
*                      description: The Post Content
*                      example: "This is my first post...."
*
*     responses:
*       200:
*        description: The Post was successfully created
*        content:
*          application/json:
*           schema:
*               type: object
*               properties:
*                  title:
*                      type: string
*                      description: The Post Title
*                      example: "My first post"
*                  content:
*                      type: string
*                      description: The Post Content
*                      example: "This is my first post...."
*                  owner:
*                     type: string
*                     description: The Post Owner
*                     example: "60f3b4b3b3b3b3b3b3b3b3b3"
*                  _id:
*                    type: string
*                    description: The Post ID
*                    example: "60f3b4b3b3b3b3b3b3b3b3"
*
*/
/**
* @swagger
* /posts/{id}:
*   delete:
*     summary: Delete a post
*     description: Delete a post by ID
*     security:
*       - bearerAuth: []
*     tags: [Posts]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the post to delete
*     responses:
*       200:
*         description: Post successfully deleted
*       404:
*         description: Post not found
*       500:
*         description: Internal server error
*/
/**
* @swagger
* /posts/{id}:
*  put:
*     summary: Update a post by ID
*     tags: [Posts]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The ID of the post to update
*         schema:
*           type: string
*           example: "60f3b4b3b3b3b3b3b3b3b3b3"
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               title:
*                 type: string
*                 description: The Post Title
*                 example: "Updated Post Title"
*               content:
*                 type: string
*                 description: The Post Content
*                 example: "Updated Post Content"
*     responses:
*       200:
*         description: Post successfully updated
*         content:
*           application/json:
*              schema:
*                type: object
*                properties:
*                  title:
*                    type: string
*                    description: The Post Title
*                  content:
*                    type: string
*                    description: The Post Content
*                  owner:
*                    type: string
*                    description: The Post Owner
*                  _id:
*                    type: string
*                    description: The Post ID
*       404:
*          description: Post not found
*       500:
*          description: Internal server error
 */
exports.default = router;
//# sourceMappingURL=posts_routes.js.map