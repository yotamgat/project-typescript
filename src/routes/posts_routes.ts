import express from "express";
const router = express.Router();
import postController from "../controllers/post_controller";

router.get("/", postController.getAll.bind(postController));
router.get("/:id", (req, res) => {
  postController.getById(req, res);
});
router.post("/", postController.create.bind(postController));
router.delete("/:id", postController.deleteById.bind(postController)); //delete the post with specific id

export default router;
