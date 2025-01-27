import postModel from "../models/posts_model";
import { Request, Response } from "express";
import mongoose, { Error, ObjectId } from "mongoose";
import { Types } from 'mongoose';
import userModel from "../models/users_model";
import commentModel from "../models/comments_model";


class PostController{
  
    async getAllPosts(req: Request, res: Response) { 
      console.log("Entered getAllPosts");
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
         console.log("Entered getPostsByOwner");
         console.log("req.body:", req.body.owner);
         console.log("req.params:", req.params.owner);
         console.log("req.query:", req.query.owner);

         const userId = req.params.owner as string;
         console.log("getPostsByOwner userId:", userId);
         if (!userId) {
           res.status(400).send("userId is required");
         }
         try {
           const posts = await postModel.find({ owner: userId });
           console.log("posts:", posts);
           res.status(200).json(posts);
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
  async deletePost(req: Request, res: Response): Promise<void> {
        console.log("Entered deletePost");
        console.log("req.body:", req.body);
        console.log("req.params:", req.params);
        const  id  = req.params.id;
        const { owner } = req.body;
        console.log("owner:", owner);
        try {
           // const post = await postModel.findById(new Types.ObjectId(id));
           // if(post?.owner.toString() !== owner){
           //     res.status(400).send({ message: "you are not the owner of this post" });
           //     return;
           // }
            const deletePost = await postModel.findByIdAndDelete(new Types.ObjectId(id));
            if (deletePost) {
                await commentModel.deleteMany({ postId: new Types.ObjectId(id) });
                res.status(200).json({ message: "post deleted" });
                return;
            } else {
                res.status(400).json({ message: "post not deleted" });
               
            }
        } catch (error) {
            res.status(500).json({ message: "problem with delete post" });
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
  likePost = async (req: Request, res: Response): Promise<void> => {
    console.log("Entered likePost");

    const  postId  = req.params.id;
    const {userId} = req.body;
    console.log("postId:", postId);
    console.log("userId:", userId);

    try {

          const post = await postModel.findById(new Types.ObjectId(postId));
          if (post?.likedBy.includes(userId)) {
              post.likedBy = post.likedBy.filter((like) => like.toString() !== userId);
              post.numOfLikes = post.likedBy.length;
              await post.save();
              res.status(200).json({ message: 'Post unliked', post });
              return;
          }
          post?.likedBy.push(userId);
          if (post) {
              post.numOfLikes = post.likedBy.length;
          }
          await post?.save();
          if (post?.likedBy) {
              res.status(200).json({ message: 'Post liked', post });
          } else {
              res.status(400).json({ message: 'Post not liked' });
          }
          } catch (error) {
              res.status(500).json({ message: 'problem with like post' });
          }
      };
        

  async updatePost(req: Request, res: Response) {
    console.log("Entered updatePost");
    console.log("req.body:", req.body);
    console.log("req.params:", req.params);
    const { id } = req.params;
    const { content, title, owner } = req.body;
    try {
      const post = await postModel.findById(new Types.ObjectId(id));
      if(owner !== post?.owner.toString()){
          res.status(400).send({ message: "you are not the owner of this post" });
          return;
      }
      const postImg = req.body.photo;
      console.log("postImg:", postImg);
      const updatePost = await postModel.findByIdAndUpdate(new Types.ObjectId(id), { content, title , postImg } , { new: true });
      console.log("updatePost:", updatePost);
      if (updatePost) {
          res.status(201).send(updatePost);
          return;
      } else {
          res.status(400).send({ message: "post not updated by id" });
          
      }
  } catch (error) {
      res.status(500).send({ message: "problem with updated by id" });
  }
}
async editPost(req: Request, res: Response) {
  console.log("Entered editPost");
  console.log("req.body:", req.body);
  console.log("req.params:", req.params);
  const { id } = req.params;
  const { content, title, _id } = req.body;
  try {
    const post = await postModel.findById(new Types.ObjectId(id));
    if(_id !== post?.owner.toString()){
        res.status(400).send({ message: "you are not the owner of this post" });
        return;
    }
    const photo = req.body.photo;

    const updatePost = await postModel.findByIdAndUpdate(new Types.ObjectId(id), { content, title , photo } , { new: true });
    if (updatePost) {
        res.status(201).send(updatePost);
        return;
    } else {
        res.status(400).send({ message: "post not updated by id" });
        
    }
} catch (error) {
    res.status(500).send({ message: "problem with updated by id" });
}
}

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


