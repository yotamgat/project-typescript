import commentsModel, { IComment } from "../models/comments_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";



class CommentController extends BaseController<IComment> {
    constructor() {
      super(commentsModel);
    }
    async createItem(req: Request, res: Response) {
        const userId = req.params.userId;
        
       
        const comment ={
          ...req.body,
          owner: userId
        };
        req.body = comment
        super.createItem(req, res); 
    };
    
    async getAllCommentsByPostId(req: Request, res: Response)  {
      console.log("Request Query:", req.query);
      const postId = req.query.postId as string;
      console.log("Received postId:", postId);
      if(!postId){
        res.status(400).send("PostId is required");
      }
      try{
        const comments = await commentsModel.find({ postId});
        res.status(200).send(comments);
      }catch(err){
        res.status(400).send(err) 
      }  
  };
}
  

export default new CommentController();
