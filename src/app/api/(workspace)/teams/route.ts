import { auth } from "@/auth";
import connectDatabase from "@/lib/database";
import { validateAccess } from "@/lib/validateAccess";
import TeamModel from "@/models/teams.models";
import UserModel from "@/models/user.models";
import WorkspaceModel from "@/models/workspace.models";
import { NextRequest, NextResponse } from "next/server";

// Get all the teams in the workspace
export const GET = async (req: NextRequest): Promise<NextResponse> => {
  await connectDatabase();
  try {
    const validateResponse = await validateAccess();
    if (validateResponse.status !== 200) {
      return validateResponse;
    }

    const session = await auth();
    const userEmail = session?.user?.email;
    const workspaceId = req.nextUrl.searchParams.get("workspaceId");

    if (!workspaceId || !userEmail) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const [user, workspace] = await Promise.all([
      UserModel.findOne({ email: userEmail }),
      WorkspaceModel.findById(workspaceId),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!workspace) {
      return NextResponse.json(
        { success: false, error: "Workspace not found" },
        { status: 404 }
      );
    }

    const teams = await TeamModel.find({
      workspaceId,
    });

    if (!teams) {
      return NextResponse.json(
        { success: false, error: "No teams found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        teams,
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
