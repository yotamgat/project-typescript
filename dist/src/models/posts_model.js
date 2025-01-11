"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose_1.Schema.ObjectId,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("Posts", PostSchema);
//import mongoose from "mongoose";
/*import {Schema,model, Types} from "mongoose";

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
*/
//# sourceMappingURL=posts_model.js.map