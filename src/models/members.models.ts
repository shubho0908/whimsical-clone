import mongoose, { Schema } from "mongoose";

interface Member {
  userId: string;
  workspaceId: string;
  role: string;
}

const memberSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "UserId is required"],
      trim: true,
    },

    workspaceId: {
      type: String,
      required: [true, "WorkspaceId is required"],
      trim: true,
    },

    role: {
      type: String,
      required: [true, "Role is required"],
    },
  },
  { timestamps: true }
);

const MemberModel =
  (mongoose.models.Member as mongoose.Model<Member>) ||
  mongoose.model<Member>("Member", memberSchema);

export default MemberModel;
