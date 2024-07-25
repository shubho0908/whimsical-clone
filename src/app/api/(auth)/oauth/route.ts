import connectDatabase from "@/lib/database";
import { validateAccess } from "@/lib/validateAccess";
import { sendWelcomeMail } from "@/lib/emails";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import WorkspaceModel from "@/models/workspace.models";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectDatabase();

    const validationResponse = await validateAccess();
    if (validationResponse.status !== 200) {
      return validationResponse;
    }

    const { name, email, profile } = await req.json();
    if (!name || !email || !profile) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: true,
          message: "User logged in",
          user: existingUser,
        },
        { status: 200 }
      );
    }

    // Create a new user
    const newUser = await UserModel.create({
      name,
      email,
      profilePicture: profile,
    });

    sendWelcomeMail(email, name);

    return NextResponse.json(
      {
        success: true,
        message: "User signed up",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in user registration:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
