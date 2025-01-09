//import mongoose from "mongoose";

import {Schema,model, Types} from "mongoose";

export interface IPost {
  title: string;
  content: string;
  owner: Types.ObjectId;
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  content: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  
});

const postModel = model<IPost>("Posts", postSchema);
export default postModel;
