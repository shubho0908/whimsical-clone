import { auth } from "@/auth";
import connectDatabase from "@/lib/database";
import { validateAccess } from "@/lib/validateAccess";
import FolderModel from "@/models/folders.models";
import MemberModel from "@/models/members.models";
import UserModel from "@/models/user.models";
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
    const folderId = req.nextUrl.searchParams.get("id");

    if (!folderId || !userEmail) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const [user, folder] = await Promise.all([
      UserModel.findOne({ email: userEmail }),
      FolderModel.findById(folderId),
    ]);

    const myself = await MemberModel.findOne({ userId: user?._id });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!folder) {
      return NextResponse.json(
        { success: false, error: "Folder not found" },
        { status: 404 }
      );
    }

    if (!myself) {
      return NextResponse.json(
        { success: false, error: "You are not a member of this workspace" },
        { status: 400 }
      );
    }

    //Check if the Folder is in the trash
    if (!folder.isDeleted) {
      return NextResponse.json(
        { success: false, error: "Folder not found in trash" },
        { status: 404 }
      );
    }

    const isAuthorized = folder.teamId
      ? myself.workspaceId === folder.workspaceId
      : user._id.toString() === folder.userId;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Permanently delete the Folder from the database
    await FolderModel.deleteOne({ _id: folderId });

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
