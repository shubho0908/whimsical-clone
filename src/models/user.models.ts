import mongoose, { Schema } from "mongoose";

export interface User {
  name: string;
  email: string;
  workspaceId: string;
  profilePicture: string;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    workspaceId: {
      type: String,
    },
    profilePicture: {
      type: String,
      required: [true, "ProfilePicture is required"],
    },
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
