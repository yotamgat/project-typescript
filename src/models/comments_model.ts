import mongoose from "mongoose";

export interface iComment {
  comment: string;
  postId: string;
  owner: string;
}
const commentSchema = new mongoose.Schema<iComment>({
  comment: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

const commentsModel = mongoose.model<iComment>("comments", commentSchema);
export default commentsModel;
