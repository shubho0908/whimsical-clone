"use client";
import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/admin-panel/menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import { useEffect, useState } from "react";
import { Workspace } from "@/models/workspace.models";
import axios from "axios";
import { BsPersonWorkspace } from "react-icons/bs";
import { FaAngleDown } from "react-icons/fa6";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MdOutlinePersonAddAlt,
  MdOutlineGroup,
  MdOutlineTipsAndUpdates,
} from "react-icons/md";
import { IoList } from "react-icons/io5";
import { FaChalkboardTeacher } from "react-icons/fa";
import { TbGridDots } from "react-icons/tb";
import { LuSettings2 } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FeatureComingSoon from "../feature-coming-soon";

interface WorkspaceType extends Workspace {
  _id: string;
}

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const router = useRouter();
  const [workspaceData, setWorkspaceData] = useState<WorkspaceType | null>(
    null
  );
  const { data: session } = useSession();

  useEffect(() => {
    const getWorkspaceData = async () => {
      try {
        if (session?.user) {
          const response = await axios.get("/api/check-workspace");
          const { data } = response;
          if (data.success) {
            setWorkspaceData(data.workspaceData);
          } else if (data.status === 404) {
            return;
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getWorkspaceData();
  }, [session]);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Popover>
            <div className="w-full flex justify-center items-center">
              <PopoverTrigger asChild>
                <div className="flex cursor-pointer items-center gap-2 justify-center w-fit">
                  <BsPersonWorkspace className="mr-2" fontSize={22} />
                  <h1
                    className={cn(
                      "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                      sidebar?.isOpen === false
                        ? "-translate-x-96 opacity-0 hidden"
                        : "translate-x-0 opacity-100"
                    )}
                  >
                    {workspaceData?.name}
                  </h1>
                  <FaAngleDown
                    className={`mr-2 ${
                      sidebar?.isOpen === false
                        ? "-translate-x-96 opacity-0 hidden"
                        : "translate-x-0 opacity-100"
                    }`}
                    fontSize={15}
                  />
                </div>
              </PopoverTrigger>
            </div>
            <PopoverContent className="w-72 relative left-10 bg-[#293845] text-white">
              <div className="menu leading-10">
                <div
                  onClick={() => {
                    window.location.href = `/workspace/invite/${workspaceData?._id}`;
                  }}
                  className="invite px-2 flex items-center justify-start hover:bg-[#1AAE9F] hover:rounded cursor-pointer transition-all"
                >
                  <MdOutlinePersonAddAlt className="mr-2" fontSize={20} />
                  <p>Invite people to {workspaceData?.name}</p>
                </div>
                <div
                  onClick={() => {
                    window.location.href = `/workspace/members/${workspaceData?._id}`;
                  }}
                  className="members px-2 flex items-center justify-start hover:bg-[#1AAE9F] hover:rounded cursor-pointer transition-all"
                >
                  <IoList className="mr-2" fontSize={20} />
                  <p>Manage members</p>
                </div>
                <FeatureComingSoon>
                  <div className="guests px-2 flex items-center justify-start hover:bg-[#1AAE9F] hover:rounded cursor-pointer transition-all">
                    <FaChalkboardTeacher className="mr-2" fontSize={20} />
                    <p>Manage guests</p>
                  </div>
                </FeatureComingSoon>
                <FeatureComingSoon>
                  <div className="teams px-2 flex items-center justify-start hover:bg-[#1AAE9F] hover:rounded cursor-pointer transition-all">
                    <MdOutlineGroup className="mr-2" fontSize={20} />
                    <p>Manage teams</p>
                  </div>
                </FeatureComingSoon>
                <FeatureComingSoon>
                  <div className="integrations px-2 flex items-center justify-start hover:bg-[#1AAE9F] hover:rounded cursor-pointer transition-all">
                    <TbGridDots className="mr-2" fontSize={20} />
                    <p>Manage integrations</p>
                  </div>
                </FeatureComingSoon>

                <FeatureComingSoon>
                  <div className="workspace-setting px-2 flex items-center justify-start hover:bg-[#1AAE9F] hover:rounded cursor-pointer transition-all">
                    <LuSettings2 className="mr-2" fontSize={20} />
                    <p>Workspace settings</p>
                  </div>
                </FeatureComingSoon>

                <FeatureComingSoon>
                  <div className="upgrade px-2 flex items-center justify-start hover:bg-[#1AAE9F] hover:rounded cursor-pointer transition-all">
                    <MdOutlineTipsAndUpdates className="mr-2" fontSize={20} />
                    <p>Upgrade {workspaceData?.name}</p>
                  </div>
                </FeatureComingSoon>
              </div>
            </PopoverContent>
          </Popover>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
