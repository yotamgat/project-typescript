import {Schema,model} from "mongoose";


const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  photo: { 
    type: String,
    default:'/default.jpeg', 
    
  },
  userImg:{
    type: String,
    required :true
  },
  username:{
    type: String,
    required :true
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
     type: Date,
    default: Date.now
  },
})

export default model("Posts", PostSchema);







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

