import { auth } from "@/auth";
import connectDatabase from "@/lib/database";
import { validateAccess } from "@/lib/validateAccess";
import InviteModel from "@/models/invite.models";
import MemberModel from "@/models/members.models";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

// Accept the invitation
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectDatabase();

    const validateResponse = await validateAccess();
    if (validateResponse.status !== 200) {
      return validateResponse;
    }

    const session = await auth();
    const userEmail = session?.user?.email;
    const { inviteId } = await req.json();

    if (!inviteId || !userEmail) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const [user, invite, existingMember] = await Promise.all([
      UserModel.findOne({ email: userEmail }),
      InviteModel.findById(inviteId),
      MemberModel.findOne({ email: userEmail, workspaceId: { $exists: true } }),
    ]);

    if (!user || !invite) {
      return NextResponse.json(
        { success: false, error: "User or invite not found" },
        { status: 404 }
      );
    }

    if (
      existingMember?.workspaceId.toString() === invite.workspaceId.toString()
    ) {
      return NextResponse.json(
        { success: false, error: "You are already a member of this workspace" },
        { status: 400 }
      );
    }

    await Promise.all([
      MemberModel.create({
        userId: user._id,
        workspaceId: invite.workspaceId,
        role: invite.role,
        email: userEmail,
      }),

      //Delete all the invites for the user
      InviteModel.deleteMany({ invitedEmail: userEmail }),
    ]);

    return NextResponse.json(
      { success: true, message: "Invitation accepted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};