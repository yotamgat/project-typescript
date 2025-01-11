//import mongoose from "mongoose";
import  { Schema, Document,model } from 'mongoose';
//const Schema = mongoose.Schema;


interface IUser  {
  email: string;
  password: string;
  refreshTokens: string[];
  _id?: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshTokens: { type: [String], default: [] },
});

const userModel = model<IUser>('User', userSchema);

export default userModel;
export { IUser };
