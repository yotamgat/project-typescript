import postModel from "../models/posts_model";
import { Request, Response } from "express";
import { Error, ObjectId } from "mongoose";


class PostController{
  async getAllPosts(req: Request, res: Response) { 
    const ownerFilter = req.query.owner;
    try {
      if (ownerFilter) {
        const post = await postModel.find({ owner: ownerFilter });
        res.send(post);
      } else {
        const post = await postModel.find();
        res.send(post);
      }
    } catch (err) {
      res.status(400).send(err);
    }
  };
  async getPostById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const post = await postModel.findById(id);
      if (post != null) {
        res.send(post);
      } else {
         res.status(404).send("Not found");
      }
    } catch (err) {
      res.status(400).send(err);
    }
  };
  async deletePost(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const rs= await postModel.findByIdAndDelete(id);
      res.status(200).send("Post Deleted");
    } catch (error) {
      res.status(400).send(error);
    }
  };
  createPost = async (req: Request, res: Response): Promise<void> => {
    console.log(req.body);
    const userId = req.userId as string; // Ensure this matches the route parameter name
    if (!userId) {
       res.status(400).send("Missing userId query parameter");
       return;
        
    }

    const { title, content } = req.body;
    if (!title || !content) {
      res.status(400).send("Missing title or content in request body");
      
    }

    try {
      const post = await postModel.create({
        title,
        content,
        owner: userId,
      });
      res.status(201).send(post);
    } catch (err) {
      res.status(400).send(err);
      
      
    }
  
};
  async updatePost(req: Request, res: Response) {
    const id = req.params.id;
    const body = req.body;
    try {
      const post = await postModel.findByIdAndUpdate (id, body, {new: true});
      res.status(200).send(post);
    } catch (err) {
      res.status(400).send(err);
    }
  };

}

export default new PostController();


/*class PostController extends BaseController<IPost> {
  constructor() {
    super(postModel);
  }
  async createItem(req: Request, res: Response) {
      const userId = req.params.userId;
      const post ={
        ...req.body,
        owner: userId
      };
      req.body = post;
      super.createItem(req, res); 
  } 
}
  */


