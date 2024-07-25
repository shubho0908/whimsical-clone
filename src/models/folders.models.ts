import mongoose, { Schema } from "mongoose";

interface Folder {
  name: string;
  userId: string;
  teamId?: string;
  workspaceId: string;
  isDeleted: boolean;
}

const folderSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    userId: {
      type: String,
      required: [true, "UserId is required"],
    },
    teamId: {
      type: String,
    },
    workspaceId: {
      type: String,
      required: [true, "WorkspaceId is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const FolderModel =
  (mongoose.models.Folder as mongoose.Model<Folder>) ||
  mongoose.model<Folder>("Folder", folderSchema);

export default FolderModel;
