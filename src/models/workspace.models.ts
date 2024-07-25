import mongoose, { Schema } from "mongoose";

export interface Workspace {
  name: string;
  userId: string;
}

const workspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    userId: {
      type: String,
      required: [true, "UserId is required"],
    },
  },
  { timestamps: true }
);

const WorkspaceModel =
  (mongoose.models.Workspace as mongoose.Model<Workspace>) ||
  mongoose.model<Workspace>("Workspace", workspaceSchema);

export default WorkspaceModel;
