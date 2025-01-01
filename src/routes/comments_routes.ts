import express from "express";
const router = express.Router();
import commentsController from "../controllers/comment_controller";

router.get("/", commentsController.getAll.bind(commentsController));
router.get("/:id", (req, res) => {
  commentsController.getById(req, res);
});
router.post("/", commentsController.create.bind(commentsController));
router.delete("/:id", commentsController.deleteById.bind(commentsController)); //delete the post with specific id

export default router;
