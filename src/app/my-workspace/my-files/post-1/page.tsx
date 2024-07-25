"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import FeatureComingSoon from "@/components/feature-coming-soon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Folder, LayoutTemplate, Presentation } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

function PostOne() {
  const { data: session } = useSession();

  return (
    <>
      <ContentLayout title="Post 1">
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
      </ContentLayout>
    </>
  );
}

export default PostOne;
