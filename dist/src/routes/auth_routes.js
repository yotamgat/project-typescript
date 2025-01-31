"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth_controller"));
const auth_controller_2 = require("../controllers/auth_controller");
const router = express_1.default.Router();
router.post("/register", auth_controller_1.default.register);
router.post("/login", auth_controller_1.default.login);
router.post("/logout", auth_controller_1.default.logout);
router.post("/refresh", auth_controller_1.default.refresh);
router.post('/googlelogin', auth_controller_1.default.googleLogin);
router.get("/user", auth_controller_2.authMiddleware, auth_controller_1.default.getUserInfo);
router.post('/user/update', auth_controller_2.authMiddleware, auth_controller_1.default.profileUpdate);
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
 *      - username
 *    properties:
 *      email:
 *        type: string
 *        description: The user's email
 *      password:
 *       type: string
 *       description: The user's password
 *      username:
 *       type: string
 *       description: The user's username
 *    example:
 *      email: 'bob@gmail.com'
 *      password: '123456'
 *      username: 'bobtest'
 */
/**
 * @swagger
 * /auth/googlelogin:
 *   post:
 *     summary: Google login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Email is required
 *       500:
 *         description: Internal server error
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
*       400:
*         description: Missing email or password
*       409:
*         description: Email already exists
*       500:
*         description: Server error
*/
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful logout
 *       400:
 *         description: Refresh token is required
 *       500:
 *         description: Internal server error
 */
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
*
*                      type: string
*                      description: User ID
*                      example: "67791ff7fb2b2485819ebb66"
*       '400':
*         description: Wrong username or password
*       '500':
*         description: Server error
*/
exports.default = router;
//# sourceMappingURL=auth_routes.js.map