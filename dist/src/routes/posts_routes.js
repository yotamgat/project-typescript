"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
const auth_controller_1 = require("../controllers/auth_controller");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *  name: Psts
 *  description: The Posts API
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
router.get("/", post_controller_1.default.getAll.bind(post_controller_1.default));
//router.get("/",(req:Request,res:Response)=>{
//    postController.getAll(req,res);
//});
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
router.get("/:id", post_controller_1.default.getById.bind(post_controller_1.default));
//router.get("/:id",(req:Request,res:Response)=>{
//    postController.getById(req,res);
//});
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
router.post("/", auth_controller_1.authMiddleware, post_controller_1.default.create.bind(post_controller_1.default));
//router.post("/",authMiddleware,(req:Request,res:Response)=>{
//    postController.create(req,res);
//});
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
router.delete("/:id", auth_controller_1.authMiddleware, post_controller_1.default.deleteItem.bind(post_controller_1.default));
//router.delete("/:id",authMiddleware,(req:Request,res:Response)=>{
//    postController.deleteItem(req,res);
//});
exports.default = router;
//# sourceMappingURL=posts_routes.js.map