import mongoose, { Schema, Model } from "mongoose";
import { Exercise, exerciseSchema } from "./Exercise";

interface User {
  username: string;
  count: number;
  log: Array<Exercise>;
}

interface UserDocument extends User, Document {}

type UserModel = Model<UserDocument>;

const userSchema: Schema<UserDocument> = new Schema<UserDocument>({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  count: { type: Number, default: 0 },
  log: [exerciseSchema],
});

const User: UserModel = mongoose.model<UserDocument, UserModel>(
  "User",
  userSchema
);

export = User;
