import express from "express";
const router = express.Router();
import postController from "../controllers/post_controller";

router.get("/", postController.getAllPosts);
router.get("/:id", (req, res) => {
  postController.getPostById(req, res);
});
router.post("/", postController.createPost);
router.delete("/:id", postController.deletePost); //delete the post with specific id

export default router;
