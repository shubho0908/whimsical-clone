import { auth } from "@/auth";
import connectDatabase from "@/lib/database";
import { validateAccess } from "@/lib/validateAccess";
import FileModel from "@/models/files.models";
import MemberModel from "@/models/members.models";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  await connectDatabase();
  try {
    const validateResponse = await validateAccess();
    if (validateResponse.status !== 200) {
      return validateResponse;
    }

    const session = await auth();
    const userEmail = session?.user?.email;

    const { filename, filetype, folderId, teamId, workspaceId } =
      await req.json();
    if (!filename || !filetype || !workspaceId) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    //Check if the current user is available in the workspace, so that they can access the file
    const isUserAvailableInWorkspace = await UserModel.findOne({
      email: userEmail,
      workspaceId,
    });

    if (!isUserAvailableInWorkspace) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 400 }
      );
    }

    await FileModel.create({
      name: filename,
      userId: userEmail,
      type: filetype,
      folderId,
      teamId,
      workspaceId,
    });

    return NextResponse.json(
      { success: true, message: "File created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectDatabase();

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

    const isAuthorized = file.teamId
      ? user.workspaceId === file.workspaceId
      : user._id.toString() === file.userId;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, data: file.data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};

// Update the file
export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
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

    const isAuthorized = file.teamId
      ? user.workspaceId === file.workspaceId
      : user._id.toString() === file.userId;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { name, type, data } = await req.json();

    await FileModel.updateOne({
      _id: fileId,
      name,
      type,
      data,
    });

    return NextResponse.json(
      { success: true, message: "File updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};

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

    const isAuthorized = file.teamId
      ? user.workspaceId === file.workspaceId
      : user._id.toString() === file.userId;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    //Send to trash
    await FileModel.updateOne({
      _id: fileId,
      isDeleted: true,
    });

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
