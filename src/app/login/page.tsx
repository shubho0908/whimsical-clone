"use client";
import { Button } from "@/components/ui/button";
import { Kanit } from "next/font/google";
import Image from "next/image";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { signIn } from "next-auth/react";
import FeatureComingSoon from "@/components/feature-coming-soon";

const kanit = Kanit({
  weight: "400",
  subsets: ["latin"],
});

function Login() {
  return (
    <>
      <div
        className={`login flex flex-col items-center justify-center ${kanit.className}`}
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
              <p className="text-[1.6rem] mt-5">Welcome Back!</p>
            </div>
            <div className="credentials w-full my-6">
              <div className="email mb-5">
                <Input
                  type="email"
                  placeholder="Email"
                  className="text-lg py-6 px-4 bg-white rounded-lg placeholder:text-gray-400"
                />
              </div>
              <div className="password">
                <Input
                  type="password"
                  placeholder="Password"
                  className="text-lg py-6 px-4 bg-white rounded-lg placeholder:text-gray-400"
                />
              </div>
              <FeatureComingSoon>
                <Button className="w-full my-5 text-lg py-6 rounded-xl hover:bg-gradient-to-r from-[#19108a] to-[#9c36d9] hover:shadow-xl transition-all">
                  Log In
                </Button>
              </FeatureComingSoon>
              <p className="text-sm text-center">Forgot password?</p>
            </div>
            <div className="seperator mt-4 w-full flex flex-col items-center justify-center">
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
                Log In with Google
                <FcGoogle className="ml-2 text-lg" />
              </Button>
            </div>
          </div>
        </div>
        <p className="text-center text-sm mt-10 text-white">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline mx-2">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}

export default Login;
