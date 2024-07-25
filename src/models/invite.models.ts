import mongoose, { Schema } from "mongoose";

export interface Invite {
  invitedEmail: string;
  workspaceId: string;
  role: string;
  inviterId: string | object;
}

const inviteSchema = new Schema(
  {
    invitedEmail: {
      type: String,
      required: [true, "InvitedEmail is required"],
      trim: true,
    },

    workspaceId: {
      type: String,
      required: [true, "WorkspaceId is required"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
    },
    inviterId: {
      type: String,
      required: [true, "InviterId is required"],
    },
  },
  { timestamps: true }
);

const InviteModel =
  (mongoose.models.Invite as mongoose.Model<Invite>) ||
  mongoose.model<Invite>("Invite", inviteSchema);

export default InviteModel;
