import mongoose, { Schema } from "mongoose";

interface Team {
  name: string;
  userId: string;
  workspaceId: string;
}

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    userId: {
      type: String,
      required: [true, "UserId is required"],
    },
    workspaceId: {
      type: String,
      required: [true, "WorkspaceId is required"],
    },
  },
  { timestamps: true }
);

const TeamModel =
  (mongoose.models.Team as mongoose.Model<Team>) ||
  mongoose.model<Team>("Team", teamSchema);

export default TeamModel;
