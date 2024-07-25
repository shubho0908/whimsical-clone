import { auth } from "@/auth";
import connectDatabase from "@/lib/database";
import { validateAccess } from "@/lib/validateAccess";
import FolderModel from "@/models/folders.models";
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
    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    const { name, teamId, workspaceId } = await req.json();

    if (!name || !workspaceId) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (user.workspaceId !== workspaceId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    await FolderModel.create({
      name,
      userId: userEmail,
      teamId,
      workspaceId,
    });

    return NextResponse.json(
      { success: true, message: "Folder created successfully" },
      { status: 201 }
    );
  } catch (error) {
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

    const isAuthorized = folder.teamId
      ? user.workspaceId === folder.workspaceId
      : user._id.toString() === folder.userId;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, data: folder }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};

// Update the folder name
export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
  await connectDatabase();
  try {
    const validateResponse = await validateAccess();
    if (validateResponse.status !== 200) {
      return validateResponse;
    }

    const session = await auth();
    const userEmail = session?.user?.email;
    const { name, folderId } = await req.json();

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

    const isAuthorized = folder.teamId
      ? user.workspaceId === folder.workspaceId
      : user._id.toString() === folder.userId;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    await FolderModel.updateOne({
      _id: folderId,
      name,
    });

    return NextResponse.json(
      { success: true, message: "Folder updated successfully" },
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

    const isAuthorized = folder.teamId
      ? user.workspaceId === folder.workspaceId
      : user._id.toString() === folder.userId;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    //Send to trash
    await FolderModel.updateOne({
      _id: folderId,
      isDeleted: true,
    });

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