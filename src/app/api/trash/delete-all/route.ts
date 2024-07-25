import { auth } from "@/auth";
import connectDatabase from "@/lib/database";
import { validateAccess } from "@/lib/validateAccess";
import FileModel from "@/models/files.models";
import FolderModel from "@/models/folders.models";
import MemberModel from "@/models/members.models";
import UserModel from "@/models/user.models";
import WorkspaceModel from "@/models/workspace.models";
import { NextRequest, NextResponse } from "next/server";

//Delete the folder from trash
export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
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

    const user = await UserModel.findOne({ email: userEmail });
    const workspace = await WorkspaceModel.findById(workspaceId);
    const myself = await MemberModel.findOne({ email: userEmail, workspaceId });
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

    if (!myself) {
      return NextResponse.json(
        { success: false, error: "You are not a member of this workspace" },
        { status: 403 }
      );
    }

    //Delete all the files and folders in the trash
    await FolderModel.deleteMany({ isDeleted: true, workspaceId });
    await FileModel.deleteMany({ isDeleted: true, workspaceId });

    return NextResponse.json(
      { success: true, message: "Folder deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
