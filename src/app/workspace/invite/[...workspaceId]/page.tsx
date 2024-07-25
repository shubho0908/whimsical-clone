"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Workspace } from "@/models/workspace.models";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaCircleCheck } from "react-icons/fa6";
import { toast } from "sonner";

function Invitation({ params }: { params: { workspaceId: string[] } }) {
  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const [email, setEmail] = useState<string>("");
  const [isInviteSent, setIsInviteSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [workspaceData, setWorkspaceData] = useState<Workspace | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getWorkspaceData = async () => {
      const response = await axios.get("/api/check-workspace");
      const { data } = response;
      if (data.success) {
        setWorkspaceData(data.workspaceData);
      }
    };
    getWorkspaceData();
  }, []);

  //Toasts

  const successToast = () => {
    toast.success("Invitation sent successfully!");
  };

  const errorToast = () => {
    toast.error("Error sending invitation");
  };

  const sendInvitation = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/invite", {
        email,
        workspaceId: params.workspaceId[0],
        role: selectedRole,
      });
      const { data } = response;
      if (data.success) {
        setIsInviteSent(true);
        setIsLoading(false);
        successToast();
        console.log("Invitation sent successfully");
      }
    } catch (error: any) {
      console.error("Error:", error);
      setIsLoading(false);
      errorToast();
      setIsInviteSent(false);
    }
  };

  if (isInviteSent) {
    return (
      <>
        <Button
          variant="secondary"
          onClick={() => {
            window.location.href = `/workspace/members/${params?.workspaceId[0]}`;
          }}
          className="rounded-sm absolute m-5 flex items-center justify-center bg-white/40 hover:bg-white/20 transition-all text-white"
        >
          <FaChevronLeft className="mr-2" fontSize={10} />
          Back
        </Button>
        <div className="flex flex-col items-center justify-center w-full h-screen">
          <div className="invite-body px-14 pb-10 pt-14 w-[600px] rounded-lg shadow bg-[#F7F9FA] flex flex-col items-center justify-center">
            <p className="text-xl">Your invitation has been sent!</p>
            <p>You&apos;ve invited 1 person to {workspaceData?.name}.</p>
            <div className="btns w-full flex items-center justify-evenly my-6">
              <Button
                onClick={() => {
                  window.location.href = `/workspace/members/${params?.workspaceId[0]}`;
                }}
                className="w-[200px] p-6 rounded-sm text-lg bg-[#31B6A8] hover:bg-[#31B6A8]/80 transition-all"
              >
                Done
              </Button>
              <Button
                onClick={() => setIsInviteSent(false)}
                className="w-[200px] text-[#31B6A8] p-6 rounded-sm text-lg border border-[#C3CFD9] hover:text-[#31B6A8]"
                variant="outline"
              >
                Invite More
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => {
          window.location.href = `/workspace/members/${params?.workspaceId[0]}`;
        }}
        className="rounded-sm absolute m-5 flex items-center justify-center bg-white/40 hover:bg-white/20 transition-all text-white"
      >
        <FaChevronLeft className="mr-2" fontSize={10} />
        Back
      </Button>
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <div className="invite-body pt-14 px-14 py-5 w-[600px] rounded-lg shadow bg-[#F7F9FA] flex flex-col items-center justify-center">
          <p className="text-xl">Invite people to Workspace</p>
          <div className="email w-full">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="name@example.com"
              className="bg-white py-6 w-full mt-2"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="role mt-8">
            <Label>Users join as</Label>{" "}
            <div className="choose-role mt-4 bg-[#EDF1F5] p-1 rounded shadow">
              <div
                className={`editor ${
                  selectedRole === "admin" ? "bg-white text-[#8F2BE2]" : null
                } rounded p-3 transition-all cursor-pointer flex items-start justify-start`}
                onClick={() => {
                  setSelectedRole("admin");
                }}
              >
                <div>
                  <span className="flex items-start justify-start">
                    {selectedRole === "admin" ? (
                      <FaCircleCheck
                        fontSize={15}
                        className="text-[#8F2BE2] mr-2 relative top-[5px]"
                      />
                    ) : null}
                    Editor
                  </span>
                  <p className="text-sm">
                    Can create, edit, access and share all files in the
                    workspace.
                  </p>
                </div>
              </div>
              <div
                className={`viewer mt-2 ${
                  selectedRole === "viewer" ? "bg-white text-[#8F2BE2]" : null
                } rounded p-3 transition-all cursor-pointer flex items-start justify-start`}
                onClick={() => {
                  setSelectedRole("viewer");
                }}
              >
                <div>
                  <span className="flex items-start justify-start">
                    {selectedRole === "viewer" ? (
                      <FaCircleCheck
                        fontSize={15}
                        className="text-[#8F2BE2] mr-2 relative top-[5px]"
                      />
                    ) : null}
                    Viewer
                  </span>
                  <p className="text-sm">
                    Can only access files in the workspace. Cannot create, edit
                    or share files.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Button
            disabled={email === "" || isLoading}
            className="w-full my-6 py-8 rounded-sm text-lg bg-[#8F2BE0]"
            onClick={sendInvitation}
          >
            Send Invitations
          </Button>
        </div>
      </div>
    </>
  );
}

export default Invitation;
