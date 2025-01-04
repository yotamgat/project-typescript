import express from "express";
import { Request, Response } from "express";
import authController from "../controllers/auth_controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: The Authentification API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *    bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *    type: object
 *    required:
 *      - email
 *      - password
 *    properties:
 *      email:
 *        type: string
 *        description: The user's email
 *      password:
 *       type: string
 *       description: The user's password
 *    example: 
 *      email: 'bob@gmail.com'
 *      password: '123456'
 */

/**
* @swagger
* /auth/register:
*   post:
*     summary: registers a new user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*        description: Registration seccess, return the new user
*        content:
*          application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*/
router.post("/register", authController.register);

/**
* @swagger
* /auth/login:
*   post:
*     summary: Authenticates a user and returns access and refresh tokens
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: Successful login
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                   accessToken:
*                      type: string
*                      description: JWT access token
*                      example: "C82ffH7JuL2xJyMnPfmRPmWBL77bCTv8JYxL7Y22"
*                   refreshToken:
*                      type: string
*                      description: JWT refresh token
*                      example: "wODh9.U4CC82ffH7JuL2xJyMnPfmRPmWBL77bCTv8JYxL7YmI"
*                   _id:
*                      type: string
*                      description: User ID
*                      example: "67791ff7fb2b2485819ebb66"
*       '400':
*         description: Wrong username or password
*       '500':
*         description: Server error
*/
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);


export default router;
