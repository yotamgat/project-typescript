import mongoose from "mongoose";
//const Schema = mongoose.Schema;

export interface IUser {
  email: string;
  password: string;
  _id?: string;
  refreshTokens?: string[];
  

}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [String],
    default: [],
  },
 
  
});

const userModel = mongoose.model<IUser>("Users", userSchema);
export default userModel;
