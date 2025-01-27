import { Schema, model,Types } from "mongoose";

const commentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  postId: {
    type: Schema.ObjectId,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.ObjectId,
    required: true,
  },
  userImg: {
    type: String,
    required: true,
  },
});

export default model("Comments", commentSchema);


/*
//import mongoose from "mongoose";
//import {Schema,model} from 'mongoose'
import { Schema, model, Types } from "mongoose";

export interface IComment {
  comment: string;
  postId: Types.ObjectId;
  owner: Types.ObjectId;
}
const commentSchema = new Schema<IComment>({
  comment: {
    type: String,
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const commentsModel = model<IComment>("comments", commentSchema);
export default commentsModel;
*/
