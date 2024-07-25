"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useSession } from "next-auth/react";

function Recent() {
  const { data: session } = useSession();

  return (
    <>
      <ContentLayout title="Recent">
        <div className="recent mx-8 my-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead className="text-center">Viewed</TableHead>
                <TableHead className="text-center">Modified</TableHead>
                <TableHead className="text-center">By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="mt-20">
              <TableRow className="bg-white p-3 shadow-xl w-fit">
                <TableCell className="font-medium">Post - 1</TableCell>
                <TableCell className="text-center">30 minutes ago</TableCell>
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

export default Recent;
