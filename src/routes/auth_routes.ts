import express from "express";
const router = express.Router();
import { Request, Response } from "express";
import authController from "../controllers/auth_controller";

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);


export default router;
