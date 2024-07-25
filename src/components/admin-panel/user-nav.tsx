"use client";

import Link from "next/link";
import { MdOutlineManageAccounts, MdExitToApp } from "react-icons/md";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

export function UserNav() {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={session?.user?.image ?? "/logo.png"}
                    alt="Avatar"
                  />
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent
        className="w-fit bg-[#293845] text-white p-3"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-start justify-start space-y-1">
            <Image
              src={session?.user?.image ?? "/profile.png"}
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full mr-2"
            />
            <div>
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-gray-300">{session?.user?.email}</p>
              <p className="mt-4 text-gray-300">WORKSPACE EDITOR</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <div className="flex items-center">
              <MdOutlineManageAccounts
                className="mr-3 text-white hover:text-black"
                fontSize={20}
              />
              Account settings
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-gray-600" />

        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => {
            signOut();
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }}
        >
          <MdExitToApp
            fontSize={20}
            className="mr-3 text-white hover:text-black"
          />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
