import { auth } from "@/auth";
import axios from "axios";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$).*)"],
};

const authRoutes = new Set(["/login", "/signup", "/"]);

export async function middleware(req: Request) {
  const session = await auth();
  const { pathname } = new URL(req.url);

  if (!session && !authRoutes.has(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!session && pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session && pathname === "/") {
    return NextResponse.redirect(new URL("/my-workspace", req.url));
  }

  if (session && authRoutes.has(pathname)) {
    return NextResponse.redirect(new URL("/my-workspace", req.url));
  }

  return NextResponse.next();
}
