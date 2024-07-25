"use client";
import { UserNav } from "@/components/admin-panel/user-nav";
import { Button } from "@/components/ui/button";
import {
  Building2,
  FileText,
  Folder,
  LayoutTemplate,
  Presentation,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import FeatureComingSoon from "@/components/feature-coming-soon";
import { useRouter } from "next/navigation";

function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="team-data">
      {/* {teamData?.map((team, index) => (
          <div className="team" key={index}>
            <p>{team.name}</p>
          </div>
        ))} */}
      <div className="top">
        <div className="cover bg-[#788896] w-full h-[200px]">
          <div className="nav w-full flex items-center p-4 justify-between">
            <Button
              variant="secondary"
              onClick={() => {
                router.push("/my-workspace/teams");
              }}
              className="rounded-sm flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all text-white ml-6"
            >
              <FaChevronLeft className="mr-2" fontSize={10} />
              All teams
            </Button>
            <UserNav />
          </div>
          <span className="text-center text-3xl text-white flex items-center justify-center">
            <Building2 className="mr-2" fontSize={24} />
            Team - 1
          </span>
        </div>
      </div>
      <div className="middle p-6 bg-[#C3CFD9] flex items-center justify-start">
        <FeatureComingSoon>
          <div className="board cursor-pointer mr-4 bg-[#8313DD] flex w-[220px] items-center justify-center shadow flex-col p-4">
            <Presentation size={50} className="text-gray-300 text-3xl" />
            <p className="text-white mt-2">+ Board</p>
          </div>
        </FeatureComingSoon>
        <FeatureComingSoon>
          <div className="doc cursor-pointer mr-4 bg-[#2C88D9] flex w-[220px] items-center justify-center shadow flex-col p-4">
            <FileText size={50} className="text-gray-300 text-3xl" />
            <p className="text-white mt-2">+ Doc</p>
          </div>
        </FeatureComingSoon>
        <FeatureComingSoon>
          <div className="template cursor-pointer mr-4 bg-[#788896] flex w-[220px] items-center justify-center shadow flex-col p-4">
            <LayoutTemplate size={50} className="text-gray-300 text-3xl" />
            <p className="text-white mt-2">+ From Template</p>
          </div>
        </FeatureComingSoon>
        <FeatureComingSoon>
          <div className="folder cursor-pointer bg-[#788896] flex w-[220px] items-center justify-center shadow flex-col p-4">
            <Folder size={50} className="text-gray-300 text-3xl" />
            <p className="text-white mt-2">+ Folder</p>
          </div>
        </FeatureComingSoon>
      </div>
      <div className="data p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="text-center">Created</TableHead>
              <TableHead className="text-center">By</TableHead>
              <TableHead className="text-center">Modified</TableHead>
              <TableHead className="text-center">By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-white p-3 shadow-xl w-fit">
              <TableCell className="font-medium">File - 1</TableCell>
              <TableCell className="text-center">Jul 25, 2024</TableCell>
              <TableCell className="text-center">
                <span className="flex items-center justify-center">
                  <Image
                    src={session?.user?.image ?? "/profile.png"}
                    alt="profile"
                    className="rounded-full mr-2"
                    width={30}
                    height={30}
                  />
                  {session?.user?.name}
                </span>
              </TableCell>
              <TableCell className="text-center">1 hour ago</TableCell>
              <TableCell className="text-center">
                <span className="flex items-center justify-center">
                  <Image
                    src={session?.user?.image ?? "/profile.png"}
                    alt="profile"
                    className="rounded-full mr-2"
                    width={30}
                    height={30}
                  />
                  {session?.user?.name}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Page;
