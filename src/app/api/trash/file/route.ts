
import { auth } from "@/auth";
import connectDatabase from "@/lib/database";
import { validateAccess } from "@/lib/validateAccess";
import FileModel from "@/models/files.models";
import MemberModel from "@/models/members.models";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

//Delete the file from trash
export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
  await connectDatabase();
  try {
    const validateResponse = await validateAccess();
    if (validateResponse.status !== 200) {
      return validateResponse;
    }

    const session = await auth();
    const userEmail = session?.user?.email;
    const fileId = req.nextUrl.searchParams.get("id");

    if (!fileId || !userEmail) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const [user, file] = await Promise.all([
      UserModel.findOne({ email: userEmail }),
      FileModel.findById(fileId),
    ]);

    const myself = await MemberModel.findOne({ userId: user?._id });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }

    if (!myself) {      
      return NextResponse.json(
        { success: false, error: "You are not a member of this workspace" },
        { status: 400 }
      );
    }

    //Check if the file is in the trash
    if (!file.isDeleted) {
      return NextResponse.json(
        { success: false, error: "File not found in trash" },
        { status: 404 }
      );
    }

    const isAuthorized = file.teamId
      ? myself.workspaceId === file.workspaceId
      : user._id.toString() === file.userId;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Permanently delete the file from the database
    await FileModel.deleteOne({ _id: fileId });

    return NextResponse.json(
      { success: true, message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
