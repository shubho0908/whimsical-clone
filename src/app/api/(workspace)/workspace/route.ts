import { auth } from "@/auth";
import connectDatabase from "@/lib/database";
import { validateAccess } from "@/lib/validateAccess";
import MemberModel from "@/models/members.models";
import TeamModel from "@/models/teams.models";
import UserModel from "@/models/user.models";
import WorkspaceModel from "@/models/workspace.models";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  await connectDatabase();
  try {
    const validationResponse = await validateAccess();
    if (validationResponse.status !== 200) {
      return validationResponse;
    }

    const { name } = await req.json();
    const session = await auth();
    const userEmail = session?.user?.email;

    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const isWorkspaceAvailable = await WorkspaceModel.findOne({
      userId: user._id,
    });
    if (isWorkspaceAvailable) {
      return NextResponse.json({
        success: false,
        message: "User already has a workspace",
      });
    }

    //Create user workspace
    const workspace = await WorkspaceModel.create({ name, userId: user._id });

    //Add user as a member of the workspace
    await MemberModel.create({
      userId: user._id,
      workspaceId: workspace._id,
      role: "admin",
    });

    // Create user's default team
    await TeamModel.create({
      name: `Everyone at ${name}'s Workspace`,
      userId: user._id,
      workspaceId: workspace._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Workspace created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  await connectDatabase();
  try {
    const validationResponse = await validateAccess();
    if (validationResponse.status !== 200) {
      return validationResponse;
    }

    const session = await auth();
    const userEmail = session?.user?.email;
    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const userId = user._id;

    const myWorkspace = await MemberModel.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $lookup: {
          from: "Workspace",
          localField: "workspaceId",
          foreignField: "_id",
          as: "allWorkspaces",
        },
      },
      {
        $unwind: "$allWorkspaces",
      },
      {
        $match: {
          "allWorkspaces.userId": userId,
        },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        myWorkspace,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
};
