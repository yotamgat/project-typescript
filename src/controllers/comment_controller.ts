import commentsModel, { IComment } from "../models/comments_model";
//import { Request, Response } from "express";
import BaseController from "./base_controller";

const commentsController = new BaseController<IComment>(commentsModel);

export default commentsController;
