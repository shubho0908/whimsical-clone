"use client";
import { Button } from "@/components/ui/button";
import { Kanit } from "next/font/google";
import Image from "next/image";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import FeatureComingSoon from "@/components/feature-coming-soon";

const kanit = Kanit({
  weight: "400",
  subsets: ["latin"],
});

function Signup() {
  return (
    <>
      <div
        className={`signup flex flex-col items-center justify-center ${kanit.className}`}
      >
        <div className="bg-white/40 p-1 rounded-[1.7rem] w-fit">
          <div className="container w-[450px] bg-[#F5F2F7] rounded-3xl flex flex-col items-center justify-center py-10">
            <div className="top flex flex-col items-center justify-center">
              <Image
                src="/logo.jpg"
                alt="logo"
                className="rounded-lg shadow-lg"
                width={50}
                height={50}
              />
              <p className="text-[1.6rem] mt-5">Join Whimsical for free</p>
            </div>
            <div className="credentials w-full my-6">
              <div className="email">
                <Input
                  type="email"
                  placeholder="Work email"
                  className="text-lg py-6 px-4 bg-white rounded-lg placeholder:text-gray-400"
                />
              </div>

              <FeatureComingSoon>
                <Button className="w-full my-5 text-lg py-6 rounded-xl hover:bg-gradient-to-r from-[#19108a] to-[#9c36d9] hover:shadow-xl transition-all">
                  Continue
                </Button>
              </FeatureComingSoon>
            </div>
            <div className="seperator w-full flex flex-col items-center justify-center">
              <Separator className="bg-gray-300" />
              <p className="bg-[#F5F2F7] px-4 relative bottom-3 text-gray-400 text-sm">
                OR
              </p>
            </div>
            <div className="oauth w-full mt-5">
              <Button
                className="w-full text-lg py-6 rounded-xl hover:bg-white hover:text-black"
                onClick={() => signIn("google")}
              >
                Sign up with Google
                <FcGoogle className="ml-2 text-lg" />
              </Button>
            </div>
            <p className="text-center text-sm mt-10 text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="mx-2 text-black">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
