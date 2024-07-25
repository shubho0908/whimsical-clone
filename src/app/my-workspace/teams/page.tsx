"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import FeatureComingSoon from "@/components/feature-coming-soon";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

function Teams() {

    const router = useRouter();

  return (
    <>
      <ContentLayout title="TEAMS">
        <div className="mx-8 my-4">
        <div className="all-teams flex items-center justify-between mt-6">
          <p className="text-xl">All Teams</p>
          <FeatureComingSoon>
            <Button className="text-lg bg-[#31B6A8] shadow text-white rounded-sm hover:bg-[#31B6A8]/80 transition-all">
              <Plus size={22} className="mr-2" /> Create a team
            </Button>
          </FeatureComingSoon>
        </div>
        <div className="my-teams mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead className="text-center">Members</TableHead>
                <TableHead className="text-center">Created</TableHead>
                <TableHead className="text-center">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
              onClick={() => {
                router.push("/my-workspace/teams/team-1");
              }}
              className="bg-white p-3 shadow-xl w-fit cursor-pointer">
                <TableCell className="font-medium">Team - 1</TableCell>
                <TableCell className="text-center">1</TableCell>
                <TableCell className="text-center">1 day ago</TableCell>
                <TableCell className="text-center">Open</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        </div>
      </ContentLayout>
    </>
  );
}

export default Teams;
