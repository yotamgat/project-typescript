import express from "express";
const router = express.Router();
import commentsController from "../controllers/comment_controller";
import { authMiddleware } from "../controllers/auth_controller";

router.get("/", commentsController.getAll.bind(commentsController));
router.get("/:id", commentsController.getById.bind(commentsController));
router.post("/",authMiddleware, commentsController.create.bind(commentsController));
router.delete("/:id",authMiddleware, commentsController.deleteItem.bind(commentsController)); //delete the post with specific id

export default router;
