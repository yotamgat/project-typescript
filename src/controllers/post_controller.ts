import postModel from "../models/posts_model";
import { Request, Response } from "express";
import mongoose, { Error, ObjectId } from "mongoose";
import { Types } from 'mongoose';
import userModel from "../models/users_model";


class PostController{
  
    async getAllPosts(req: Request, res: Response) { 
        const ownerFilter = req.query.owner;
        try {
            if (ownerFilter) {
              const post = await postModel.find({ owner: ownerFilter });
              res.send(post);
            } else {
              const post = await postModel.find();
              res.status(200).json(post);
            }
        } catch (error) {
          res.status(400).json({ message: "Failed to fetch posts", error });
        }
    };
    async getPostsByOwner(req: Request, res: Response) {

         const userId = req.query.owner as string;
         if (!userId) {
           res.status(400).send("userId is required");
         }
         try {
           const posts = await postModel.find({ owner: userId });
           res.status(200).send(posts);
         } catch (err) {
           res.status(400).send(err);
         }
     
       }

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
    console.log("Entered createPost");
    const userId=req.body._id;
    console.log("userId:", userId);
    try {
     
      const photo = req.body.photo;
      console.log("photo:", photo);
      console.log("Content:", req.body.content);
      console.log("Title:", req.body.title);
      console.log("User Img:", req.body.userImg);


      const newPost = await postModel.create({
        title : req.body.title,
        content: req.body.content,
        owner: userId,
        userImg: req.body.userImg,
        username: req.body.username,
        photo,
      });
      res.status(201).json({
        message: 'Post created successfully',
        post: newPost,
    });
    } catch (error) {
      res.status(500).json({ message: "Failed to create post", error });
      
      
    }
  };
  savePhoto = async (req: Request, res: Response): Promise<void> => {
    console.log("Entered savePhoto");
  
    try {
        if (!req.file) {
            res.status(400).send({message:"file not found"});
            return;
        }
        const fileUrl = `/uploads/${req.file.filename}`;  // Fixed template string syntax
        const base = process.env.DOMAIN_BASE + "/";
        console.log("fileUrl:", { url: base + req.file?.path });
        res.status(200).send({ url: base + req.file?.path })
        
    } catch (error) {
        res.status(500).send({message:"Error uploading file"});
    }
}
  



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


