import { auth } from "@/auth";
import connectDatabase from "@/lib/database";
import { sendInvitationMail } from "@/lib/emails";
import { validateAccess } from "@/lib/validateAccess";
import InviteModel from "@/models/invite.models";
import MemberModel from "@/models/members.models";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectDatabase();

    const validateResponse = await validateAccess();
    if (validateResponse.status !== 200) {
      return validateResponse;
    }

    const { email, workspaceId, role } = await req.json();
    const session = await auth();
    const myEmail = session?.user?.email;

    if (!myEmail) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email });
    const myself = await UserModel.findOne({ email: myEmail });
    if (!myself) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
        },
        { status: 400 }
      );
    }

    if (user) {
      const isMemberAvailable = await MemberModel.findOne({
        userId: user._id,
        workspaceId,
      });

      if (isMemberAvailable) {
        return NextResponse.json(
          {
            success: false,
            message: "User already has access to this workspace",
          },
          { status: 409 }
        );
      }
    }

    const invite = await InviteModel.create({
      invitedEmail: email,
      workspaceId,
      role,
      inviterId: myself?._id,
    });

    await sendInvitationMail(myEmail, email, invite._id.toString());

    return NextResponse.json(
      { success: true, message: "Invitation sent successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in invitation process:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};

//All invitations
export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectDatabase();

    const validateResponse = await validateAccess();
    if (validateResponse.status !== 200) {
      return validateResponse;
    }

    const workspaceId = req.nextUrl.searchParams.get("workspaceId");

    const allPendingInvitations = await InviteModel.find({
      workspaceId,
    }).populate({
      path: "inviterId",
      model: "User",
      select: "name email",
    });

    return NextResponse.json(
      {
        success: true,
        invitations: allPendingInvitations,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
