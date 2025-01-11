import commentsModel from "../models/comments_model";
import { Request, Response } from "express";
import { Types } from 'mongoose';

class CommentController {

  async getAllComments(req: Request, res: Response) {
    try {
      const comments = await commentsModel.find();
      res.send(comments);
    } catch (err) {
      res.status(400).send (err);
    }
  }

  async getAllCommentsByPostId(req: Request, res: Response) {
    const postId = req.query.postId as string;
    console.log("Received postId:", postId);
    if (!postId) {
      res.status(400).send("PostId is required");
    }
    try {
      const comments = await commentsModel.find({ postId });
      res.status(200).send(comments);
    } catch (err) {
      res.status(400).send(err);
    }

  }

  async getCommentById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const comment = await commentsModel.findById(id);
      if (comment != null) {
        res.status(200).send(comment);
      } else {
        res.status(404).send("Not found");
      }
    } catch (err) {
      res.status(404).send(err);
    }
  }

  async deleteComment(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const rs = await commentsModel.findByIdAndDelete(id);
      res.status(200).send("Comment Deleted");
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async createComment(req: Request, res: Response) {
    const userId=req.userId;
    const comment={...req.body,owner:userId};
    console.log(req.body);
    req.body=comment;
    try {
      const comment = await commentsModel.create(req.body);
      res.status(201).send(comment);
    } catch (err) {
      res.status (400).send (err);
    }
    
  }

  async updateComment(req: Request, res: Response) {
    const id = req.params.id;
    const body = req.body;
    try {
      const comment = await commentsModel.findByIdAndUpdate(id, body, { new: true });
      res.status(200).send(comment);
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

export default new CommentController();
