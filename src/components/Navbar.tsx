"use client";
import { useSession } from "next-auth/react";
import { Kanit } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserNav } from "./admin-panel/user-nav";
import FeatureComingSoon from "./feature-coming-soon";

const kanit = Kanit({
  weight: "400",
  subsets: ["latin"],
});

function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      <div
        className={`navbar p-6 md:w-2/3 w-full text-sm flex items-center justify-between ${kanit.className}`}
      >
        <div className="left">
          <Image
            src="/logo.png"
            alt="logo"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>
        <div className="right flex items-center justify-center">
          <FeatureComingSoon>
            <Link href="#" className="text-white">
              Contact support
            </Link>
          </FeatureComingSoon>
          <div
            className={`vr bg-gray-${
              pathname === "/signup" ? "300" : "600"
            } w-[2px] h-3 mx-3`}
          ></div>
          {session ? (
            <UserNav />
          ) : (
            <Link
              href={pathname === "/signup" ? "/login" : "/signup"}
              className="text-white"
            >
              {pathname === "/signup" ? "Log in" : "Sign up"}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
