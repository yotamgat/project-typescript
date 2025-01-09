import express,{Request,Response,NextFunction} from "express";
import postController from "../controllers/post_controller";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();

router.get("/", postController.getAll.bind(postController));
router.get("/:id", postController.getById.bind(postController));
router.post("/", authMiddleware ,postController.createItem.bind(postController));
router.delete("/:id", authMiddleware ,postController.deleteItem.bind(postController));
router.put("/:id", authMiddleware, postController.updateItem.bind(postController));


/**
 * @swagger
 * tags:
 *  name: Posts
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


export default router;
