"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaChevronLeft, FaChevronDown } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { Invite } from "@/models/invite.models";
import { FaCircleCheck } from "react-icons/fa6";
import { Workspace } from "@/models/workspace.models";
import { MdRemoveCircleOutline, MdExitToApp } from "react-icons/md";
import Loader from "@/lib/Loader";
import { UserNav } from "@/components/admin-panel/user-nav";
import FeatureComingSoon from "@/components/feature-coming-soon";
import { toast } from "sonner";

interface Member {
  _id: string;
  userId: {
    name: string;
    profilePicture: string;
    email: string;
  };
  role: string;
}

interface InviteType extends Invite {
  inviterId: {
    name: string;
    email: string;
  };
}

function Page({ params }: { params: { workspaceId: string[] } }) {
  const { data: session } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [activeInvitations, setActiveInvitations] = useState<InviteType[]>([]);
  const [invalidAccess, setInvalidAccess] = useState<boolean>(false);
  const [workspaceData, setWorkspaceData] = useState<Workspace | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getWorkspace = async () => {
      const response = await axios.get("/api/check-workspace");
      const { data } = response;
      if (data.success) {
        setWorkspaceData(data.workspaceData);
        if (data?.workspaceData?._id !== params.workspaceId[0]) {
          setInvalidAccess(true);
        }
      }
    };
    getWorkspace();
  }, [params.workspaceId]);

  useEffect(() => {
    const getMembers = async () => {
      try {
        if (session) {
          const response = await axios.get("/api/members", {
            params: {
              workspaceId: params.workspaceId[0],
            },
          });
          const { data } = response;
          if (data.success) {
            setMembers(data.members);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getMembers();
  }, [session, params.workspaceId, selectedRole]);

  useEffect(() => {
    const getActiveInvitations = async () => {
      const response = await axios.get(
        "/api/invite?workspaceId=" + params.workspaceId[0]
      );
      const { data } = response;
      if (data.success) {
        setActiveInvitations(data.invitations);
      }
    };
    getActiveInvitations();
  }, [params.workspaceId]);

  //Toasts

  const successToast = () => {
    toast.success("Role updated successfully!");
  };

  const errorToast = (error: string) => {
    toast.error(error);
  };

  const updateMemberRole = async (memberId: string, newRole: string) => {
    try {
      if (session) {
        const response = await axios.patch("/api/members", {
          workspaceId: params.workspaceId[0],
          role: newRole,
          memberId,
        });
        const { data } = response;
        if (data.success) {
          setSelectedRole(newRole);
          successToast();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      errorToast("Error updating role");
    }
  };

  const buttons = [
    "Members",
    "Guests",
    "Teams",
    "Settings",
    "Integrations",
    "Upgrade",
  ];

  if (invalidAccess) {
    return <div>Invalid access</div>;
  }

  if (!workspaceData || !members) {
    return <Loader />;
  }

  return (
    <>
      <div className="members-page">
        <div className="cover z-[-1] flex flex-col items-center justify-center w-screen h-[200px] absolute bg-gradient-to-r from-[#37349A] to-[#9541DF]">
          <p className="relative bottom-2 text-white text-xl">
            {workspaceData?.name}
          </p>
        </div>
        <div className="top p-4 flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={() => {
              router.push("/my-workspace");
            }}
            className="rounded-sm flex items-center justify-center bg-white/10 hover:bg-[#9C42E4] transition-all text-white"
          >
            <FaChevronLeft className="mr-2" fontSize={10} />
            Back to Workspace
          </Button>
          {/* <Image
            src={session?.user?.image ?? "/logo.jpg"}
            alt="profile"
            width={34}
            height={34}
            className="rounded-full"
          /> */}
          <UserNav />
        </div>
        <div className="tabs relative top-[84px] w-full flex items-center justify-center">
          {buttons.map((button, index) => {
            const ButtonComponent = (
              <Button
                key={index}
                className={`rounded-[2px] shadow-none rounded-b-none text-lg p-6 mx-1 ${
                  index == 0
                    ? "bg-white text-[#37349A] hover:bg-white"
                    : "bg-white/20 hover:bg-white/40 text-white"
                }`}
              >
                {button}
              </Button>
            );

            return index > 0 ? (
              <FeatureComingSoon key={index}>
                {ButtonComponent}
              </FeatureComingSoon>
            ) : (
              ButtonComponent
            );
          })}
        </div>
        <div className="flex flex-col items-center justify-center relative top-[120px]">
          <div className="members w-[62%]">
            <div className="info flex items-center justify-between">
              <div className="left flex items-center justify-center">
                <p className="text-xl">All Members ({members?.length})</p>
                <Input
                  type="text"
                  placeholder="Search members"
                  className="bg-[#eaebed] focus:bg-white ml-4 p-5 w-fit rounded-[2px]"
                />
              </div>
              <div className="right">
                <Button
                  onClick={() => {
                    router.push(`/workspace/invite/${params.workspaceId[0]}`);
                  }}
                  className="rounded-sm bg-[#31B6A8] hover:bg-[#31B6A8]/80 text-white text-lg p-5 w-fit shadow"
                >
                  Invite new members
                </Button>
              </div>
            </div>
            <Separator className="my-6 bg-gray-200" />
            <div className="all-members">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Teams</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members?.map((member, index) => (
                    <TableRow key={index}>
                      <TableCell className="flex items-center justify-center">
                        <Image
                          src={member.userId.profilePicture}
                          alt={member.userId.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="container flex flex-col items-start justify-center">
                          <p className="">{member.userId.name} (You)</p>
                          <p className="text-gray-500">{member.userId.email}</p>
                        </div>
                      </TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <TableCell className="cursor-pointer text-blue-600 hover:text-blue-800">
                            <div
                              onClick={() => {
                                setSelectedRole(member.role);
                              }}
                              className="flex items-center justify-center w-fit"
                            >
                              <p>
                                {member.role === "admin"
                                  ? "Admin/Editor"
                                  : "Viewer"}
                              </p>
                              <FaChevronDown
                                className="text-blue-600 hover:text-blue-800 ml-1"
                                fontSize={10}
                              />
                            </div>
                          </TableCell>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] bg-[#293845] text-gray-300 rounded-lg">
                          <div className="top bg-[#222E3A] p-2 rounded-lg">
                            <div
                              onClick={() => {
                                setSelectedRole("admin");
                                updateMemberRole(member._id, "admin");
                              }}
                              className={`editor cursor-pointer p-3 hover:bg-[#384957] rounded ${
                                selectedRole === "admin"
                                  ? "bg-[#8F2BE0] text-white hover:bg-[#8F2BE0]"
                                  : null
                              }`}
                            >
                              <span className="flex items-start justify-start">
                                {selectedRole === "admin" ? (
                                  <FaCircleCheck
                                    fontSize={15}
                                    className="text-white mr-2 relative top-[4px]"
                                  />
                                ) : null}
                                Editor
                              </span>
                              <p className="text-sm">
                                Can create, edit, access and share all files in
                                the workspace.
                              </p>
                            </div>
                            <div
                              onClick={() => {
                                setSelectedRole("viewer");
                                updateMemberRole(member._id, "viewer");
                              }}
                              className={`viewer mt-2 transition-all hover:bg-[#384957] cursor-pointer p-3 rounded ${
                                selectedRole === "viewer"
                                  ? "bg-[#8F2BE0] text-white hover:bg-[#8F2BE0]"
                                  : null
                              }`}
                            >
                              <span className="flex items-start justify-start">
                                {selectedRole === "viewer" ? (
                                  <FaCircleCheck
                                    fontSize={15}
                                    className="text-white mr-2 relative top-[4px]"
                                  />
                                ) : null}
                                Viewer
                              </span>
                              <p className="text-sm">
                                Can only access files in the workspace. Cannot
                                create, edit or share files.
                              </p>
                            </div>
                          </div>
                          <FeatureComingSoon>
                            <div className="bottom flex items-center justify-start p-2 mt-2 transition-all hover:bg-red-500 hover:text-white cursor-pointer rounded">
                              {member.userId.email === session?.user?.email ? (
                                <>
                                  <MdExitToApp
                                    className="text-white mr-2"
                                    fontSize={20}
                                  />

                                  <p>Leave workspace</p>
                                </>
                              ) : (
                                <>
                                  <MdRemoveCircleOutline
                                    className="text-white mr-2"
                                    fontSize={20}
                                  />

                                  <p>Remove from workspace</p>
                                </>
                              )}
                            </div>
                          </FeatureComingSoon>
                        </PopoverContent>
                      </Popover>

                      <TableCell>Today</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Separator className="my-10 bg-gray-200" />
            <div className="active-invitations">
              <p>There are {activeInvitations?.length} active invitations</p>
              <div className="active mt-6">
                {activeInvitations?.map((invitation, index) => (
                  <div
                    key={index}
                    className="invitation shadow rounded p-5 my-2 bg-gray-50"
                  >
                    <p className="font-light">
                      {invitation?.inviterId?.name} ({invitation?.inviterId?.email})
                      invited {invitation?.invitedEmail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
