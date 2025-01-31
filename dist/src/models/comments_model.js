"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    comment: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose_1.Schema.ObjectId,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose_1.Schema.ObjectId,
        required: true,
    },
    userImg: {
        type: String,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("Comments", commentSchema);
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
//# sourceMappingURL=comments_model.js.map