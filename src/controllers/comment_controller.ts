import commentsModel from "../models/comments_model";
import { Request, Response } from "express";
import userModel from "../models/users_model";
import postModel from "../models/posts_model";
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
    console.log("Entered getAllCommentsByPostId");
    const postId = req.params.postId as string;
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
      console.log("Entered deleteComment");
      console.log("req.body", req.body);
      console.log("req.params", req.params);

      const  commentId  = req.params.id;
      const { userId } = req.body; 
      console.log("commentId", commentId);
      console.log("userId", userId);
      try {
         const comment = await commentsModel.findById(new Types.ObjectId(commentId));
         console.log("comment", comment);
         //if(comment?.owner.toString() !== userId) {
        //  res.status(400).send({ message: "you are not the owner of this comment" });
         //   return;
         //}
         await commentsModel.findByIdAndDelete(new Types.ObjectId(commentId));
         await postModel.findByIdAndUpdate(comment?.postId, { $inc: { numOfComments: -1 } });
         res.status(200).send({ message: "comment deleted successfully" });
         return;
      } catch (error) {
         res.status(400).send({ message: "internal server error" });
      }
  }

  async createComment(req: Request, res: Response) {
      console.log("Entered createComment");
      console.log("req.body aa", req.body);
      const comment = req.body.comment;
      const postId = req.body.postId;
      const userId = req.body.owner; 
      try {
         const user = await userModel.findById(new Types.ObjectId(userId));
         const  username = user?.username;
         console.log("username", username);
         const  userImg = user?.image;
         console.log("img", userImg);
         const newComment = await commentsModel.create({
            comment,
            postId: new Types.ObjectId(postId),
            username,
            owner:  new Types.ObjectId(userId),
            userImg  
        });
         if (newComment) {
          
            await postModel.findByIdAndUpdate(new Types.ObjectId(postId), { $inc : { numOfComments: 1 } }, { new: true });
            res.status(201).send(newComment);
            return;
         } else {
          
            res.status(400).send("problem with new comment");
            
         }
      } catch (error) {
         
         res.status(400).send({ message: "internal server error" });
      }


  }
  

  async updateComment(req: Request, res: Response) {
    console.log("Entered updateComment");
    console.log("req.body", req.body);
    console.log("req.params", req.params);
    console.log("req.body.commentData", req.body.commentData);
    const  commentId  = req.params.id;
    const { comment, postId, userImg, username, owner } = req.body;
      try {
        const updatedComment = await commentsModel.findByIdAndUpdate(
           new Types.ObjectId(commentId),
           { comment, postId, userImg, username, owner },
           { new: true }
        );
        console.log("commentId", commentId);  
        console.log("updatedComment", updatedComment);
     
        if (updatedComment) {
           res.status(200).send(updatedComment);
          
           return;
        } else {
            res.status(400).send("problem with new");
           
           return;
        }
     } catch (error) {
        res.status(400).send({ message: "internal server error" });
     }
    }
}

export default new CommentController();
