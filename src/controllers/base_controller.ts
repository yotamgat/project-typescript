import { Request, Response } from "express";
import { Model } from "mongoose";

class BaseController<T> {
  model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async getAll(req: Request, res: Response) {
    const ownerFilter = req.query.owner;
    try {
      if (ownerFilter) {
        const posts = await this.model.find({ owner: ownerFilter });
        res.status(200).send(posts);
      } else {
        const posts = await this.model.find();
        res.status(200).send(posts);
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async getById(req: Request, res: Response) {
    const postId = req.params.id;
    try {
      const post = await this.model.findById(postId);
      if (post === null) {
        return res.status(404).send("Post not found");
      } else {
        return res.status(200).send(post);
      }
      res.status(200).send(post);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async create(req: Request, res: Response) {
    const post = req.body;
    try {
      const newPost = await this.model.create(post);
      res.status(201).send(newPost);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async deleteById(req: Request, res: Response) {
    const postId = req.params.id;
    try {
      await this.model.findByIdAndDelete(postId);
      res.status(200).send();
    } catch (err) {
      res.status(400).send(err);
    }
  }
}
const createController = <T>(model: Model<T>) => {
  return new BaseController(model);
};

export default createController;
