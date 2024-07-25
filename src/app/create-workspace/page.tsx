"use client";
import { Button } from "@/components/ui/button";
import { Kanit } from "next/font/google";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loader from "@/lib/Loader";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const kanit = Kanit({
  weight: "400",
  subsets: ["latin"],
});

function Workspace() {
  const { data: session } = useSession();
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  //Toasts
  const successToast = () => {
    toast.success("Workspace created successfully!");
  };

  const errorToast = () => {
    toast.error("Error creating workspace");
  };

  useEffect(() => {
    const checkWorkspace = async () => {
      try {
        if (session) {
          const response = await axios.get("/api/check-workspace");
          const { data } = response;
          if (data.success) {
            if (data.myWorkspace) {
              router.push("/my-workspace");
            } else {
              setIsLoading(false);
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    checkWorkspace();
  }, [session, router]);

  const createWorkspace = async () => {
    try {
      if (!workspaceName) {
        return;
      }

      const response = await axios.post("/api/workspace", {
        name: workspaceName,
      });

      const { data } = response;
      if (data.success) {
        successToast();
        router.push("/my-workspace");
      }
    } catch (error: any) {
      console.error("Error:", error);
      errorToast();
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="bg-img absolute z-[-1] w-screen h-screen">
        <Image src="/signup.jpg" alt="bg" fill className="object-cover" />
      </div>
      <div className="navbar flex items-center justify-center">
        <Navbar />
      </div>
      <div
        className={`workspace h-[70vh] flex flex-col items-center justify-center ${kanit.className}`}
      >
        <div className="bg-white/40 p-1 rounded-[1.7rem] w-fit">
          <div className="container w-[500px] bg-[#F5F2F7] rounded-3xl flex flex-col items-center justify-center">
            <div className="top flex flex-col items-center justify-center">
              <p className="text-[1.6rem] mt-5">Create a new workspace</p>
              <p className="text-gray-500 text-center">
                Build solo or with your team in a new shared workspace
              </p>
            </div>
            <div className="credentials w-full my-6">
              <div className="email mb-5">
                <Label htmlFor="email">Workspace name</Label>
                <Input
                  type="email"
                  placeholder={`${session?.user?.name}'s workspace`}
                  className="p-5 bg-white rounded-lg placeholder:text-gray-500 my-3"
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
              </div>

              <Button
                onClick={createWorkspace}
                disabled={workspaceName === null || workspaceName === ""}
                className="w-full text-lg py-8 rounded-xl hover:bg-white hover:text-black"
              >
                Create new workspace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Workspace;
