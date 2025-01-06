import postModel, { IPost } from "../models/posts_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";

class PostController extends BaseController<IPost> {
  constructor() {
    super(postModel);
  }
  async create(req: Request, res: Response) {
      const _id = req.params.userId;
      const post ={
        ...req.body,
        owner: _id
      };
      req.body = post;
      super.create(req, res); 
  } 
}

export default new PostController();
