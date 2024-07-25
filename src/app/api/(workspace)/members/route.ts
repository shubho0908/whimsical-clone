import { auth } from "@/auth";
import connectDatabase from "@/lib/database";
import { validateAccess } from "@/lib/validateAccess";
import MemberModel from "@/models/members.models";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectDatabase();

    const validateResponse = await validateAccess();
    if (validateResponse.status !== 200) {
      return validateResponse;
    }

    const workspaceId = req.nextUrl.searchParams.get("workspaceId");
    if (!workspaceId) {
      return NextResponse.json(
        { success: false, error: "Invalid workspaceId" },
        { status: 400 }
      );
    }

    const members = await MemberModel.find({
      workspaceId,
    }).populate({
      path: "userId",
      model: "User",
      select: "name profilePicture email",
    });

    if (!members) {
      return NextResponse.json(
        { success: false, error: "No members found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        members,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in invitation process:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};

// Update member's role

export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectDatabase();

    const validateResponse = await validateAccess();
    if (validateResponse.status !== 200) {
      return validateResponse;
    }

    const session = await auth();
    const userEmail = session?.user?.email;
    const { role, memberId, workspaceId } = await req.json();

    if (!memberId || !userEmail || !role || !workspaceId) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const [user, member] = await Promise.all([
      UserModel.findOne({ email: userEmail }),
      MemberModel.findById(memberId),
    ]);

    const myself = await MemberModel.findOne({
      userId: user?._id,
      workspaceId,
    });

    if (!user || !member || !myself) {
      return NextResponse.json(
        { success: false, error: "User, member, or requester not found" },
        { status: 404 }
      );
    }

    // Check if the user and member are in the same workspace
    if (member.workspaceId.toString() !== workspaceId) {
      return NextResponse.json(
        { success: false, error: "User is not a part of the workspace" },
        { status: 400 }
      );
    }

    // Check if the user is an admin or owns the workspace
    const isAdmin = myself.role === "admin";
    const isWorkspaceOwner = user.workspaceId && user.workspaceId.toString() === workspaceId;

    if (!isAdmin && !isWorkspaceOwner) {
      return NextResponse.json(
        { success: false, error: "You don't have permission to update member roles" },
        { status: 403 }
      );
    }

    await MemberModel.updateOne({ _id: memberId }, { role });

    return NextResponse.json(
      { success: true, message: "Member updated successfully", role },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating member role:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};

//Remove member from workspace
export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
  await connectDatabase();

  try {
    const validateResponse = await validateAccess();
    if (validateResponse.status !== 200) {
      return validateResponse;
    }

    const memberId = req.nextUrl.searchParams.get("userId");
    if (!memberId) {
      return NextResponse.json(
        { success: false, error: "Invalid memberId" },
        { status: 400 }
      );
    }

    await MemberModel.findByIdAndDelete(memberId);
    return NextResponse.json(
      { success: true, message: "Member removed successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
