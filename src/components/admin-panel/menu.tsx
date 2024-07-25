"use client";

import Link from "next/link";
import { Ellipsis, LogOut, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { RiDeleteBin6Line } from "react-icons/ri";
import { LuLayoutTemplate } from "react-icons/lu";
import FeatureComingSoon from "../feature-coming-soon";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);
  const router = useRouter();

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          <FeatureComingSoon>
            <Button
              variant="outline"
              className="w-full hover:shadow transition-all hover:bg-white hover:text-[#7693D9] text-[#7693D9]"
            >
              <Plus
                color="#7693D9"
                className={`${isOpen === true ? "mr-2" : null}`}
              />
              {isOpen === true ? "Create New" : null}
            </Button>
          </FeatureComingSoon>

          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <>
                  <div className="flex justify-between items-center hover:bg-[#F6F6F7] transition-all cursor-pointer p-2 rounded">
                    <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate relative top-[4px]">
                      {groupLabel}
                    </p>
                  </div>
                </>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className="w-full justify-start h-10 mb-1"
                              asChild
                              onClick={() => {
                                router.push(href);
                              }}
                            >
                              <div>
                                <span
                                  className={cn(isOpen === false ? "" : "mr-4")}
                                >
                                  <Icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    "max-w-[200px] truncate",
                                    isOpen === false
                                      ? "-translate-x-96 opacity-0"
                                      : "translate-x-0 opacity-100"
                                  )}
                                >
                                  {label}
                                </p>
                              </div>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  )
              )}
            </li>
          ))}
          <li className="w-full grow flex flex-col items-end justify-end">
            <Button
              onClick={() => {
                router.push("/my-workspace/templates-and-themes");
              }}
              variant={
                pathname === "/my-workspace/templates-and-themes"
                  ? "secondary"
                  : "ghost"
              }
              className="w-full justify-start h-10 mb-2"
            >
              <span className={cn(isOpen === false ? "" : "mr-4")}>
                <LuLayoutTemplate size={18} />
              </span>
              <p
                className={cn(
                  "whitespace-nowrap",
                  isOpen === false ? "opacity-0 hidden" : "opacity-100"
                )}
              >
                Templates and themes
              </p>
            </Button>
            <Button
              onClick={() => {
                router.push("/my-workspace/trash");
              }}
              variant={
                pathname === "/my-workspace/trash" ? "secondary" : "ghost"
              }
              className="w-full justify-start h-10"
            >
              <span className={cn(isOpen === false ? "" : "mr-4")}>
                <RiDeleteBin6Line size={18} />
              </span>
              <p
                className={cn(
                  "whitespace-nowrap",
                  isOpen === false ? "opacity-0 hidden" : "opacity-100"
                )}
              >
                Trash
              </p>
            </Button>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
