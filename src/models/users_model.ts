//import mongoose from "mongoose";
import  { Schema, Document,model } from 'mongoose';
//const Schema = mongoose.Schema;


interface IUser  {
  email: string;
  password?: string;
  refreshTokens: string[];
  _id?: string;
  username: string;
}

const userSchema = new Schema<IUser>({
    email: { 
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: false
    },
    refreshTokens: {
        type: [String],
        default: []
    },
   
    username:{
        type: String,
        required: true,
    }
});

const userModel = model<IUser>('User', userSchema);

export default userModel;
export { IUser };
