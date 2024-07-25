import { auth } from "@/auth";
import connectDatabase from "@/lib/database";
import { validateAccess } from "@/lib/validateAccess";
import FileModel from "@/models/files.models";
import TeamModel from "@/models/teams.models";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  await connectDatabase();
  try {
    const validateResponse = await validateAccess();
    if (validateResponse.status !== 200) {
      return validateResponse;
    }

    const session = await auth();
    const userEmail = session?.user?.email;
    const teamId = req.nextUrl.searchParams.get("teamId");

    if (!teamId || !userEmail) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const [user, team] = await Promise.all([
      UserModel.findOne({ email: userEmail }),
      TeamModel.findById(teamId),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!team) {
      return NextResponse.json(
        { success: false, error: "Team not found" },
        { status: 404 }
      );
    }        

    //Get all the files in the team
    const files = await FileModel.find({
      teamId,
    });

    if (!files) {
      return NextResponse.json(
        { success: false, error: "No files found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        files,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};