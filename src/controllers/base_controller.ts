import { Request, Response } from "express";
import {  Model } from "mongoose";

class BaseController<T> {
  model: Model<T>;
  constructor(model: any) {
    this.model = model;
  }

  async getAll(req: Request, res: Response) {
    const ownerFilter = req.query.owner;
    try {
      if (ownerFilter) {
        const item = await this.model.find({ owner: ownerFilter });
        res.send(item);
      } else {
        const items = await this.model.find();
        res.send(items);
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const item = await this.model.findById(id);
      if (item != null) {
        res.send(item);
      } else {
         res.status(404).send("Not found");
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async create(req: Request, res: Response) {
    const body = req.body;
    try {
      const item = await this.model.create(body);
      res.status(201).send(item);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async deleteItem(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const rs= await this.model.findByIdAndDelete(id);
      res.status(200).send("Item Deleted");
    } catch (error) {
      res.status(400).send(error);
    }
  }
}


export default BaseController;
