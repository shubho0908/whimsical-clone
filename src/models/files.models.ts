import mongoose, { Schema } from "mongoose";

interface File {
  name: string;
  userId: string;
  type: string;
  data: object;
  folderId?: string;
  teamId?: string;
  workspaceId: string;
  isDeleted: boolean;
}

const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    userId: {
      type: String,
      required: [true, "UserId is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
    },
    data: {
      type: Object,
    },
    folderId: {
      type: String,
    },
    teamId: {
      type: String,
    },
    workspaceId: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const FileModel =
  (mongoose.models.File as mongoose.Model<File>) ||
  mongoose.model<File>("File", fileSchema);

export default FileModel;
