import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const validateAccess = async (): Promise<NextResponse> => {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: true, message: "User is authenticated" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};