import express from "express";
const router = express.Router();
import postController from "../controllers/post_controller";
import { authMiddleware } from "../controllers/auth_controller";



router.get("/", postController.getAll.bind(postController));
router.get("/:id", postController.getById.bind(postController));

router.post("/", authMiddleware ,postController.create.bind(postController));
router.delete("/:id", authMiddleware ,postController.deleteItem.bind(postController)); //delete the post with specific id

export default router;
