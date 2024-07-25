import { auth } from "@/auth";
import connectDatabase from "@/lib/database";
import { validateAccess } from "@/lib/validateAccess";
import UserModel from "@/models/user.models";
import WorkspaceModel from "@/models/workspace.models";
import { NextRequest, NextResponse } from "next/server";

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
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const myWorkspace = await WorkspaceModel.findOne({ userId: user._id });
    return NextResponse.json(
      {
        success: true,
        myWorkspace: myWorkspace ? true : false,
        workspaceData: myWorkspace,
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
